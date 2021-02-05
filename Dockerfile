FROM node:10-slim

RUN apt-get update \
    && apt-get install -y wget gnupg2

RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -yq \
    gconf-service \
    libasound2 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgcc1 \
    libgconf-2-4 \
    libgdk-pixbuf2.0-0 \
    libglib2.0-0 libgtk-3-0 \
    libnspr4 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 libx11-6 \
    libx11-xcb1 libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    ca-certificates \
    fonts-liberation \
    libappindicator1 \
    libnss3 \
    lsb-release \
    xdg-utils \
    gosu \
    google-chrome-unstable \
    fonts-ipafont-gothic \
    fonts-wqy-zenhei \
    fonts-thai-tlwg \
    fonts-kacst \
    ttf-freefont \
    && rm -rf /var/lib/apt/lists/*

# Tell app this is run inside docker.
ENV DOCKER true

# Make app directory.
RUN mkdir /app
RUN chmod 777 /app
WORKDIR /app

# Copy code.
COPY . /app

# Install packages.
RUN npm install

# Add user app
RUN groupadd --gid "911" -r app \
    && useradd -u "911" -r -g app -d /usr/src/app -c "Docker Image User" app \
    && mkdir /usr/src/app

COPY docker-entrypoint.sh /usr/local/bin/
RUN ln -s usr/local/bin/docker-entrypoint.sh / # backwards compat

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]