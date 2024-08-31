from canvasapi import Canvas
import json
import eel
eel.init("web")


CURRENT_ENV = 'prod_prod'
ROOT_URL_MAP = {
    'prod_beta': '',
    'prod_prod': ''
}

ROOT_ACCOUNT = 1


def render_error_message(e, add_message):
    error_message = {
        'error': f"An error has occured: {e}. {add_message}"}
    to_render = json.dumps(error_message)
    eel.renderErrorMessage(to_render)


def login():
    try:
        KEY_FILE = './key'
        with open(KEY_FILE, 'r') as key_file:
            for line in key_file.readlines():
                if line.startswith(CURRENT_ENV + ': '):
                    API_KEY = line.split(': ')[1].strip()
                if line.startswith(CURRENT_ENV + '_root: '):
                    global ROOT_ACCOUNT
                    ROOT_ACCOUNT = line.split(': ')[1].strip()
        API_URL = ROOT_URL_MAP[CURRENT_ENV]
        return Canvas(API_URL, API_KEY)
    except Exception as e:
        render_error_message(e, "Please make sure you've created a key file containing your Canvas API key and root account ID")


canvas = login()

all_subaccounts_in_instace = []

@eel.expose
def send_subaccount_names_on_first_load():
    #loading all subaccount objects
    try:
        root_account = canvas.get_account(ROOT_ACCOUNT)
        all_subaccounts = root_account.get_subaccounts(include=['sub_account_count', 'course_count'], recursive=True)

        all_subaccounts_in_instace.append(root_account)

        for each in all_subaccounts:
            all_subaccounts_in_instace.append(each)
        
        subaccount_names = []

        for each_sub in all_subaccounts_in_instace:
            subaccount_names.append({
                'id': each_sub.id,
                'name': each_sub.name
            })
        subaccount_payload = json.dumps(subaccount_names)
        return subaccount_payload
    except Exception as e:
        render_error_message(e, "Please make sure the account ID you've provided in the key file is correct")



def build_hierarchy(graph, node, ref):
    # Initialize a hierarchy structure for the current node
    hierarchy = {"name": ref[node]['name'], "children": []}
   
    # Recursively build the hierarchy for each child of the current node
    for child in graph.get(node, []):
        hierarchy["children"].append(build_hierarchy(graph, child, ref))

    return hierarchy

@eel.expose
def initiate_tree_generation(sub_json):
    subaccount = json.loads(sub_json)
    subaccount_id = subaccount['id']

    #find subaccount object with the id
    selected_subacc_obj = None
    for each in all_subaccounts_in_instace:
        if each.id == int(subaccount_id):
            selected_subacc_obj = each
    
    #after finding, execute function
    hierarchy_json = generate_hieraechy_from_canvas(selected_subacc_obj)

    payload = {
        'viz_json': hierarchy_json,
        'width': subaccount['width']
    }

    return json.dumps(payload)



def generate_hieraechy_from_canvas(root_obj):
    #grabbing the immediate children of the root account
    root_subaccounts = root_obj.get_subaccounts()
    #grabbing entire children list of root account
    all_subaccounts = root_obj.get_subaccounts(include=['sub_account_count', 'course_count'], recursive=True)

    ref_dict = {}
    all_ids = []
    graph = {}

    #populating the reference dictionary
    for each in all_subaccounts:
        ref_dict[each.id] = {
            'name': each.name, 
            'parent': each.parent_account_id
        }
        #generate all ids for iteration
        all_ids.append(each.id)

        #create nodes for graph
        graph[each.id] = []


    #add root account to ref_dict
    ref_dict[root_obj.id] = {
        'name': root_obj.name,
        'parent': None
    }

    for each_id in all_ids:
        for each_sub in ref_dict:
            #find out if subaccount corresponding to each_id is a parent
            if ref_dict[each_sub]['parent'] == each_id:
                graph[each_id].append(each_sub)


    #adding root-node to the graph
    root_ids = []

    for each in root_subaccounts:
        root_ids.append(each.id)


    graph[root_obj.id] = root_ids


    hierarchy_json = build_hierarchy(graph, root_obj.id, ref_dict)

    return hierarchy_json


def main():
    eel.start("index.html")


if __name__ == "__main__":
    main()

