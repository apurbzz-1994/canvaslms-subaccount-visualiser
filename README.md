# canvaslms-subaccount-visualiser
A Python admin tool for rendering subaccount hierarchy graphs for the Canvas LMS

![first version screenshot](/git_assets/sgrab_1.png)

## Purpose
In my line of work, oftentimes, I'm having to explain the subaccount structure of our institutional Canvas LMS instance to vendors and various stakeholders. So I wrote this small admin tool to help me out with just that and figured it would help other Canvas admins as well. 

The tool makes use of the [Canvas API](https://canvas.instructure.com/doc/api/) to load a subaccount (along with nested subaccounts) of your choice (provided you're assigned an Admin role for said subaccount) and employs [D3.JS](https://d3js.org/) to render a tree-graph that represents the subaccount hierarchy. You're also able to export the raw JSON data for the graph and hook it to any visualisation tool of your choice. 