/*ljy创建的用来存放公共函数*/
/**
 * 该方法用于配合树形类组件，根据当前的节点值，获取当前节点的完整路径值（含父节点路径-递归，不包含子节点路径）
 * 思维：穷举法找到完整路径。
 * 说明：即一个一个从顶级目录开始查找，直到直到目标节点为止。
 * @param value 指当前节点值，key值
 * @param key 这里的Key不是指节点的key值，而是指集合中实体key的名称（如实体menu的主键为id，则输入id）
 * @param arr 树形数组
 * @returns {[]} 返回的是节点对象数组，按照位置0开始排序，形式是：祖父节点对象->父节点对象->当前节点对象。
 */
const getRootPathAtTreeByKey=(value, key, arr) => {
  let tempPath = [];//用来记录最终要返回的数组
  try {
    for (let i = 0; i < arr.length; i++) {//在根目录遍历树形目录
      getNodePath(arr[i]);//将节点对象放入函数中递归找
    }
  } catch (e) {
    return tempPath;
  }
  function getNodePath(node) {//定义一个函数，用于递归找目标节点，并把位置记录
    tempPath.push(node);//先将节点放入，作为节点的准路径；如果后面通过该节点证实找不到目标节点，则删除该节点
    //如果找到符合条件的节点，通过throw终止掉递归
    if (node[key] === value) {
      throw ("GOT IT!");
    }else{//如果该节点不是目标节点，则继续往下递归查找
      //如果该节点还有子目录，则继续循环递归找
      if (node.children && node.children.length > 0) {
        for (let i = 0; i < node.children.length; i++) {
          getNodePath(node.children[i]);
        }
        //当前节点的子节点遍历完依旧没找到，则删除路径中的该节点
        tempPath.pop();//pop() 方法将删除 arrayObject 的最后一个元素，把数组长度减 1，并且返回它删除的元素的值。如果数组已经为空，则 pop() 不改变数组，并返回 undefined 值。
      } else {//如果该节点已经没有子节点，说明该节点肯定不属于父路径，
        //删除路径当中的该叶子节点
        tempPath.pop();
      }
    }

  }
}

/**
 * 针对element ui的cascade的BUG设计
 * 说明：
 * 如果树形数组最底层子项的 children为空数组，这样就会造成该子项对应一个空的空级联，bug存在。
 * @param data 树形数组的json格式。
 * @returns {*}
 */
const setTreeNodeChildrenForUndefined=(data)=>{
  // 循环遍历json数据
  for(let i=0;i<data.length;i++){
   if(data[i].children==null||data[i].children.length==0){//data[i].children==null为对节点作验证，防止下面的length因为数组为null，出错
      data[i].children=undefined;
    }else {
      // children若不为空数组，则继续 递归调用 本方法
      setTreeNodeChildrenForUndefined(data[i].children);
    }
  }
}

export default {
  getRootPathAtTreeByKey: getRootPathAtTreeByKey, //获取当前节点的完整路径值（含父节点路径-递归，不包含子节点路径）
  setTreeNodeChildrenForUndefined:setTreeNodeChildrenForUndefined
}
