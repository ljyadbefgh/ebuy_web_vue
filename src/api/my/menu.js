function getRootPathAtTreeByKey(value, key, arr){//value是指具体的key值，key是指集合中key的名称（如id），arr为属性数组
  console.log("执行方法");
  let temppath = [];
  try {
    function getNodePath(node){
      // 这里可以自定义push的内容，而不是整个node,而且这里node也包含了children
      temppath.push(node);
      //找到符合条件的节点，通过throw终止掉递归
      if (node[key] === value) {
        throw ("GOT IT!");
      }
      if (node.children && node.children.length > 0) {
        for (let i = 0; i < node.children.length; i++) {
          getNodePath(node.children[i]);
        }

        //当前节点的子节点遍历完依旧没找到，则删除路径中的该节点
        temppath.pop();
      }
      else {
        //找到叶子节点时，删除路径当中的该叶子节点
        temppath.pop();
      }
    }
    for (let i = 0; i < arr.length; i++) {
      getNodePath(arr[i]);
    }
  } catch (e) {
    return temppath;
  }
}
export {getRootPathAtTreeByKey}
