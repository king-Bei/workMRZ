# ---- Build backend ----
FROM node:18-alpine AS backend-build
WORKDIR /app
COPY backend/package*.json ./backend/
RUN cd backend && npm install
COPY backend ./backend

# ---- Build frontend ----
FROM node:18-alpine AS frontend-build
WORKDIR /frontend
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install
COPY frontend ./frontend
RUN cd frontend && npm run build

# ---- Production image ----
FROM node:18-alpine
WORKDIR /app

# Copy backend
COPY --from=backend-build /app/backend ./

# Copy frontend build to backend public folder
COPY --from=frontend-build /frontend/frontend/build ./public

# Copy .env if you want to bake it in (建議用 Secret Manager 注入)
# COPY backend/.env .env

ENV NODE_ENV=production
EXPOSE 8080

CMD ["node", "app.js"]
