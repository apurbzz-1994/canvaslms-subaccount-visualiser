# canvaslms-subaccount-visualiser
A Python admin tool for rendering subaccount hierarchy graphs for the [Canvas LMS](https://www.instructure.com/en-au/canvas)

![first version screenshot](/git_assets/sgrab_1.png)

## Purpose
In my line of work, oftentimes, I'm having to explain the subaccount structure of our institutional Canvas LMS to vendors and various stakeholders. So I wrote this small admin tool to help me out with just that and figured it would be useful to other Canvas admins as well. 

The tool makes use of the [Canvas API](https://canvas.instructure.com/doc/api/) to load a subaccount (along with nested subaccounts) of your choice (provided you're assigned an Admin role for said subaccount) and employs [D3.JS](https://d3js.org/) to render a tree-graph that represents the subaccount hierarchy. You're also able to export the raw JSON data for the graph and hook it to any visualisation tool of your choice.

The tool is written in Python using the [Eel library](https://github.com/python-eel/Eel) and can be run locally without any web servers.

## How to run

### Initial setup 
1. Install the latest version of Python from [https://www.python.org/downloads](https://www.python.org/downloads/), ensuring that you've added Python to your `PATH` (more on this here: [https://realpython.com/add-python-to-path](https://realpython.com/add-python-to-path/)). 

2. Clone this repository in your machine. It is recommended to use a Python virtual environment (like [venv](https://docs.python.org/3/library/venv.html)) so that all modules and dependencies can be housed neatly in one place.

3. Open your terminal and `cd` to the repository directory and run the following command:

    `pip install -r requirements.txt`

This will install all necessary modules. 

Alternatively, you can choose to individually install them via `pip` calls:

- Eel - `pip install eel`
- Canvas API - `pip install canvasapi`


### Setting up the key file
In order for the tool to interact with the Canvas API, it needs an API key/access token. You're able to generate one for your Canvas user account by following the instructions in this article - [How do I manage API access tokens as an admin?](https://community.canvaslms.com/t5/Admin-Guide/How-do-I-manage-API-access-tokens-as-an-admin/ta-p/89)

Once generated, create a text file named `key` in the same directory as the repo. Afterwards, add a line to the file with a key to denote your Canvas instance (for example, prod_prod, prod_beta etc), and set the value of the key to your access token. For example:

`prod_prod: yoUrAcCesstokeNgoEsHere`

You can also add a line afterwards to denote which subaccount you have admin access to that you'd need to visualise. This would look something like this:

`prod_prod_root`: 56

Here, 56 is the subaccount ID. You're able to find this by accessing the subaccount via Canvas and inspecting the URL. It should be the number at the end:

`yourcanvasinstance.com/accounts/185`

> [!NOTE]
> Please note, if you don't set the subaccount in the keys file, it will be set to 1 by default, denoting the root account. 


### Setting up the URL of your Canvas instance
1. Open `main.py`

2. Look for the ROOT_URL_MAP dictionary. Here, add the same key that you used in the key file (e.g, prod_prod), and set the value to the URL of your Canvas instance:

```
ROOT_URL_MAP = {
    'prod_prod': 'mycanvasurl.com'
}
```

3. Locate the CURRENT_ENV variable and set it's value to the key denoting your Canvas instance:

```
CURRENT_ENV = prod_prod
```

### Running the application
To run the application, open a terminal, `cd` to the correct directory and run the following command:

`python3 main.py`

Depending on your system, you may need to use `python` or `python3` in the above command

This will launch the dashboard. 

## Dependencies

Python dependencies:
- [Eel](https://github.com/python-eel/Eel) 
- [Canvas API Python Wrapper](https://canvasapi.readthedocs.io/en/stable/getting-started.html)

Frontend dependencies:
- Bootsrap 4.6.2 is being used via the CDN (you're able to find the corresponding stylesheet and script tages in  `index.html`). 
- D3.JS is being used via the CDN [https://cdn.jsdelivr.net/npm/d3@7](https://cdn.jsdelivr.net/npm/d3@7)
