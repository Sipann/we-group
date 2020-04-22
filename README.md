# WeGroup
CodeWorks Solo Project

WeGroup is an app allowing people to group their commodities orders. It has been inspired by the current Covid situation where people can not go out often and do their shopping easily.

To run the app, you must:
* clone the repo
* create a postgreSQL database
* create tables by running the dbSetup_readme.js file
* provide back-up info as detailed in the config-example.js file (server)
* provide your firebase info as detailed in the environment-example.js file (client)


## Stack

* Backend: Node.js with Koa framework
* Database: PostgreSQL
* Services: Google Firebase Authentication
* Client: Ionic Framework on top of Angular


## Demo

WeGroup app menu.

![app-menu](./rd_images/app-menu.png)

Commands available for a "regular" member of a group when placing an order is possible.

![regular-user-commands](./rd_images/regular-user-menu.png)


Commands available for a "regular" member of a group when placing an order is NOT possible.

![regular-user-commands](./rd_images/regular-user-menu2.png)


When it is possible to place an order, the link routes to the "order" page:

![place-order](./rd_images/place-order.png)



Commands available for the "manager" member of a group.

![group-details-manager](./rd_images/group-details-manager-small.png)


The extra "Manage Group" command reaches the following "managing page":

![group-manage-page](./rd_images/group-manage-page.png)


Where the "Group Manager" can :

Check and Update the group general information:

![group-manage-infos](./rd_images/group-manage-infos.png)


Manage the available products:

![group-manage-products](./rd_images/group-manage-products.png)


Manage members of his/her group:

![group-manage-members](./rd_images/group-manage-members.png)


And have a recap of what to order to the supplier:

![group-manage-summary](./rd_images/group-manage-summary.png)
