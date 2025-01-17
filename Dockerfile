# Gunakan base image resmi Node.js versi LTS
FROM node:18

# Set environment variable
ENV NODE_ENV=production

# Tentukan direktori kerja di dalam container
WORKDIR /app

# Salin file package.json dan package-lock.json ke dalam container
COPY package*.json ./

# Install dependensi aplikasi
RUN npm install --production

# Salin semua file dari direktori lokal ke dalam container
COPY . ./

# Salin isi folder src ke dalam container (opsional jika ingin lebih spesifik)
COPY src ./src

# Expose port yang digunakan oleh aplikasi Express.js
EXPOSE 3000

# Perintah untuk menjalankan aplikasi
CMD ["node", "src/index.js"]