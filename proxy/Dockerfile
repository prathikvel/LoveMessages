# Pull the Nginx image from Docker Hub
FROM nginx

# Copy Nginx configuration
COPY default.conf /etc/nginx/conf.d/default.conf

# Expose the port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
