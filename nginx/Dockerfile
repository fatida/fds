# Use the official Nginx image from the Docker Hub
FROM nginx:latest

# Copy the custom configuration file to the Nginx configuration directory
COPY default.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to the outside world
EXPOSE 80

# Start Nginx when the container has provisioned
CMD ["nginx", "-g", "daemon off;"]