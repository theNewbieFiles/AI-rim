



export function BehaviorTree(NodeID, Tree, Comp) {

    //Nodes[Tree.root]();


}

//////////////////////////////////////nodes

/**
 * Contains one or more children nodes
 * executes all children in order and stops if any return success
 * returns failure if all nodes fail
 *
 */
export function bTSelector(NodeID, Comp) {

    let nodeData = Comp.NodeSelector.get(NodeID);

    if(!nodeData){
        return 'failure';
    }

    let currentNode = nodeData.currentNode;
    let children = nodeData.children;


    let results = children[currentNode].execute();

    if(results === 'success'){
        return 'success';
    }else if(results === 'failure'){

    }
}



