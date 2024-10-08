# canvaslms-subaccount-visualiser
A Python admin tool for rendering subaccount hierarchy graphs for the [Canvas LMS](https://www.instructure.com/en-au/canvas)

![first version screenshot](/git_assets/sgrab_1.png)

## Introduction
In my line of work, oftentimes, I'm having to explain the subaccount structure of our institutional Canvas LMS to vendors and various stakeholders. So I wrote this small admin tool to help me out with just that and figured it would be useful to other Canvas admins as well, especially those having to deal with complex org structures.  

The tool makes use of the [Canvas API](https://canvas.instructure.com/doc/api/) to load a subaccount (along with its nested subaccounts) of your choice (provided you're an Admin in said subaccount) and employs [D3.JS](https://d3js.org/) to render tree-graphs that represent the subaccount hierarchy. You're able to adjust the root node to inspect each nested subaccount individually or in a holistic way, and export the raw JSON data for the graphs to pass to any visualisation platform/application of your choice. 

The tool is written in Python using the [Eel library](https://github.com/python-eel/Eel) and can be run locally without any web servers.

## How to run

### Initial setup 
1. Install the latest version of Python from [https://www.python.org/downloads](https://www.python.org/downloads/), ensuring that you've added Python to your `PATH` (more on this here: [https://realpython.com/add-python-to-path](https://realpython.com/add-python-to-path/)). 

2. Clone this repository in your machine or download the project files via `Code > Download ZIP`. It is recommended to use a Python virtual environment (like [venv](https://docs.python.org/3/library/venv.html)) so that all modules and dependencies can be housed neatly in one place.

3. Open your terminal and `cd` to the repository directory and run the following command:

    ```
    pip install -r requirements.txt
    ```

    This will install all necessary modules. 

    Alternatively, you can choose to individually install them via `pip` calls:

    - Eel - `pip install eel`
    - Canvas API - `pip install canvasapi`


### Setting up the key file
In order for the tool to interact with the Canvas API, it needs an access-token. You're able to generate one for your Canvas user account by following the instructions elucidated in this article - [How do I manage API access tokens as an admin?](https://community.canvaslms.com/t5/Admin-Guide/How-do-I-manage-API-access-tokens-as-an-admin/ta-p/89)

Once generated, create a file named `key` in the same directory as the project files. Afterwards, add a line to the file like the one below:

```
prod_prod: yoUrAcCesstokeNgoEsHere
```

Here, "prod_prod" is a key that represents your Canvas instance (you can name this key anything you want, but needs to be consistent everywhere). Then, after the colon is where you paste your access-token.   

You can also add a next line afterwards to denote which subaccount you have admin access to that you'd like to visualise. This would look something like this:

```
prod_prod_root: 56
```

Here, 56 is the subaccount ID. You're able to find this by accessing the subaccount via Canvas and inspecting the URL. It should be the number at the end:

```
yourcanvasinstance.com/accounts/56
```

> [!NOTE]
> Please note, if you don't set the subaccount in the key file, it will be set to 1 by default, which is the root account. 


### Setting up the URL of your Canvas instance
1. Open `main.py`.

2. Look for the `ROOT_URL_MAP` dictionary. Here, add the same key that you used in the key file (e.g, prod_prod), and set its value to the URL of your Canvas instance:

```
ROOT_URL_MAP = {
    'prod_prod': 'mycanvasurl.com'
}
```

3. Locate the `CURRENT_ENV` variable and set it's value to the key denoting your Canvas instance:

```
CURRENT_ENV = prod_prod
```

### Running the application
After all the aforementioned setup is completed, to run the application, open a terminal, `cd` to the correct directory and run the following command:

```
python3 main.py
```

Depending on your system, you may need to use `python` or `python3` in the above command. 

This will launch the dashboard. 

## Printing and PDF
While this project does not make use of a third-party PDF library to export PDF copies or prints of the generated graphs, a print template has been provided within the `print_template` folder so that the browser's print function can be utilised to create a PDF.

### Steps
1. Use the tool to copy the JSON data (by clicking the `Export JSON` button) for the graph that you wish to export as PDF:

    ![copy JSON from tool](/git_assets/print_step_1.png)

2. In the `print_template` folder, open `data.js` and then paste the JSON after `const data =`:

    ```
    const data = paste_your_json_here
    ```

3. Open the `print_template.html` file in your browser. This should give you a static version of the graph: 

    ![static graph in html](/git_assets/print_step_3.png)

4. Use the browser's print function (usually `File > Print`) to `Save as PDF`. 

## Dependencies

Python dependencies:
- [Eel](https://github.com/python-eel/Eel) 
- [Canvas API Python Wrapper](https://canvasapi.readthedocs.io/en/stable/getting-started.html)

Frontend dependencies:
- [Bootsrap 4.6.2](https://getbootstrap.com/docs/4.6/getting-started/download/) is being used via the CDN (you're able to find the corresponding stylesheet and script tages in  `index.html`). 
- D3.JS is being used via the CDN [https://cdn.jsdelivr.net/npm/d3@7](https://cdn.jsdelivr.net/npm/d3@7)
