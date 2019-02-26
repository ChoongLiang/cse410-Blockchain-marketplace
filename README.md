# CSE410 - Blockchain Marketplace
#### By Alex Kim & ChoongLiang Tan

# Start the server
(If you are not using WebStorm, only apply to IDE and terminal)

First, cd in to the project folder.

Then, type in:

```
node app.js
```

**If port is in use, change to other port.**

else you should see 

```
Server started on port #
MongoDB connected
```

Now the server is up.

To access the pages, open up any browser, then goto

(ie. Port Number 3000)

[https://localhost://3000](https://localhost://3000)

Accessing database
==================

1. Type in mongo in the terminal to enter mongo shell.
2. Then,

```
use blockchain_market
```

3. You should see that we are switched to the right database.
4. To check a list of registered users,

```
db.users.find()
```

5. And.. that's it for now.
