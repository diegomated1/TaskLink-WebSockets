CREATE KEYSPACE TaskLink WITH REPLICATION = {'class': 'SimpleStrategy', 'replication_factor': '1'};
USE TaskLink;

CREATE TABLE messages_by_chat(
    chat_id TEXT,
    message_id UUID,
    sender_id UUID,
    receiver_id UUID,
    content TEXT,
    create_timestamp TIMESTAMP,
    is_read BOOLEAN,
    has_image BOOLEAN,
    image_paths LIST<TEXT>,
    PRIMARY KEY (chat_id, create_timestamp)
);

CREATE TABLE routes_by_offert_id(
    offert_id INT,
    encoded_polyline TEXT,
    distance_meters FLOAT,
    duration TEXT,
    PRIMARY KEY (offert_id)
);

CREATE TABLE location_by_region(
    city TEXT,
    subcountry TEXT,
    latitude FLOAT,
    longitude FLOAT,
    PRIMARY KEY (subcountry, city, latitude, longitude)
);
