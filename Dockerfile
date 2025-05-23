FROM node:22-bookworm

# Set default user home
ENV HOME=/home/app-user

# Install ffmpeg and Chromium dependencies
RUN apt-get update && apt-get install -y \
  ffmpeg \
  wget \
  ca-certificates \
  fonts-liberation \
  libappindicator3-1 \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcups2 \
  libdbus-1-3 \
  libgdk-pixbuf2.0-0 \
  libnspr4 \
  libnss3 \
  libx11-xcb1 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  xdg-utils \
  libu2f-udev \
  libvulkan1 \
  chromium \
  chromium-sandbox \
  xvfb \
  alsa-utils \
  pulseaudio \
  x11-utils \
  dbus-x11 \
  xauth \
  unclutter \
  && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /tmp/.X11-unix && chmod 1777 /tmp/.X11-unix

# Create user and working dirs
RUN useradd -m -d $HOME -s /bin/bash app-user && \
    mkdir -p $HOME/app/dist && \
    mkdir -p /var/log/puppeteercast && \
    chown -R app-user:app-user $HOME /var/log/puppeteercast

# Set working dir
WORKDIR $HOME/app


COPY . ./
RUN chown -R app-user:app-user .

USER app-user

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
RUN npm install

# Expose application port
EXPOSE 3000

# Start application
CMD [ "node", "backend/dist/main.js", "--envargs=1" ]