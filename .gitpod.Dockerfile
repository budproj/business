FROM gitpod/workspace-full

USER gitpod

RUN bash -c ". .nvm/nvm.sh \
    && nvm install 15.5.1 \
    && nvm use 15.5.1 \
    && nvm alias default 15.5.1"

RUN echo "nvm use default &>/dev/null" >> ~/.bashrc.d/51-nvm-fix
