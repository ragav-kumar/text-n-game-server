CREATE TABLE users
(
    id       MEDIUMINT    NOT NULL PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email    VARCHAR(255) NOT NULL UNIQUE
);

# Defines all applications that are allowed on this server
CREATE TABLE oauth_clients
(
    id VARCHAR(80) NOT NULL PRIMARY KEY
);
# Defines all active access tokens. Tokens are deleted upon invalidation
CREATE TABLE oauth_access_tokens
(
    access_token VARCHAR(40) NOT NULL PRIMARY KEY,
    client_id    VARCHAR(80) NOT NULL,
    user_id      MEDIUMINT,
    expires      TIMESTAMP   NOT NULL,
    FOREIGN KEY (client_id) REFERENCES oauth_clients (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
# Defines all active refresh tokens. Tokens are deleted upon invalidation
CREATE TABLE oauth_refresh_tokens
(
    refresh_token VARCHAR(40) NOT NULL PRIMARY KEY,
    client_id     VARCHAR(80) NOT NULL,
    user_id       MEDIUMINT,
    expires       TIMESTAMP   NOT NULL,
    FOREIGN KEY (client_id) REFERENCES oauth_clients (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
# Static channels have an ID and a name.
# Dynamic channels are defined by their users, and have no name
CREATE TABLE channels
(
    id   MEDIUMINT                  NOT NULL PRIMARY KEY,
    name VARCHAR(255),
    type enum ('static', 'dynamic') NOT NULL DEFAULT 'static'
);

#Cross table for channel user lists
CREATE TABLE channel_users
(
    channel MEDIUMINT NOT NULL,
    user    MEDIUMINT NOT NULL,
    PRIMARY KEY (channel, user),
    FOREIGN KEY (channel) REFERENCES channels (id) ON DELETE CASCADE,
    FOREIGN KEY (user) REFERENCES users (id) ON DELETE CASCADE
);
# All messages across all channels!
CREATE TABLE messages
(
    id      BIGINT    NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user    MEDIUMINT NOT NULL,
    channel MEDIUMINT NOT NULL,
    text    TEXT      NOT NULL,
    time    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (channel) REFERENCES channels (id) ON DELETE CASCADE,
    FOREIGN KEY (user) REFERENCES users (id) ON DELETE NO ACTION
);