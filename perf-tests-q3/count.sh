gfind . -name 'business-canary*.log' -exec bash -c 'egrep "^query: " "{}" > "$(basename {} .log)-queries.sql"' \;
gfind . -name 'business-canary*.sql' -exec bash -c 'echo "{}: `wc -l {}`"' \; | sort
