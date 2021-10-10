####
#
# Build the image with:
#
# docker build -t felipewind/shopping-postgres:13.3 .
#
# Then run the container using:
#
# docker run -d --name postgres-shop --rm -p 5432:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=postgres felipewind/shopping-postgres:13.3
#
###

FROM postgres:13.3

COPY init.sql /docker-entrypoint-initdb.d/init.sql