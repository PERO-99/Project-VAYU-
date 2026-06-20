FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Set placeholder values during the build phase so Vite embeds these specific strings into the JS files
ENV VITE_GEMINI_API_KEY=VITE_GEMINI_API_KEY_PLACEHOLDER
ENV VITE_CONTACT_EMAIL=VITE_CONTACT_EMAIL_PLACEHOLDER
ENV VITE_INSTAGRAM_URL=VITE_INSTAGRAM_URL_PLACEHOLDER
ENV VITE_WEB3FORMS_KEY=VITE_WEB3FORMS_KEY_PLACEHOLDER

RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create a startup script that runs every time the container starts.
# It replaces the placeholder strings in the compiled Javascript with the ACTUAL environment variables
# provided by Google Cloud Run at runtime.
RUN echo '#!/bin/sh' > /docker-entrypoint.d/40-envsubst.sh && \
    echo 'for file in /usr/share/nginx/html/assets/*.js; do' >> /docker-entrypoint.d/40-envsubst.sh && \
    echo '  if [ -f "$file" ]; then' >> /docker-entrypoint.d/40-envsubst.sh && \
    echo '    sed -i "s|VITE_GEMINI_API_KEY_PLACEHOLDER|${VITE_GEMINI_API_KEY}|g" "$file"' >> /docker-entrypoint.d/40-envsubst.sh && \
    echo '    sed -i "s|VITE_CONTACT_EMAIL_PLACEHOLDER|${VITE_CONTACT_EMAIL}|g" "$file"' >> /docker-entrypoint.d/40-envsubst.sh && \
    echo '    sed -i "s|VITE_INSTAGRAM_URL_PLACEHOLDER|${VITE_INSTAGRAM_URL}|g" "$file"' >> /docker-entrypoint.d/40-envsubst.sh && \
    echo '    sed -i "s|VITE_WEB3FORMS_KEY_PLACEHOLDER|${VITE_WEB3FORMS_KEY}|g" "$file"' >> /docker-entrypoint.d/40-envsubst.sh && \
    echo '  fi' >> /docker-entrypoint.d/40-envsubst.sh && \
    echo 'done' >> /docker-entrypoint.d/40-envsubst.sh && \
    chmod +x /docker-entrypoint.d/40-envsubst.sh

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
