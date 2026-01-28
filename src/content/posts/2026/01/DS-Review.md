---
title: 数据结构A期末回顾
published: 2026-01-29
updated: 2026-01-29
encrypted: false
pinned: false
tags:
  - 大二上
category: 课程学习
draft: false
---
考试时间：2026 年 1 月 10 日 8：30-10：30，第一门期末考试

原本是打算数据结构与算法基础两门课一起准备掉的。1 月 8 至 1 月 10 日有人工智能论坛大会。导致复习的时间支离破碎，不过陆陆续续也复习了一些。看了点代码随想录，自己也整理了些东西。数据结构往年卷不多，考研卷倒是有一大堆。在我的科大上面下载下来看了几眼，判断题比较恶心，感觉像是在考文科题，没有什么美感。

助教在考前放出了考试范围。首先把没学过的 B 树看了看，然后挨个点去复习。考试中最恶心的就是日历用二叉树排序，还有哈夫曼树计算。排序+转二叉树转了半个多小时。后面算法题到不是特别困难，半小时写完 3 道，给分也比较放水，遗憾的是第一题错了一半，邻接表写成邻接矩阵了，别的都还好

# 考试范围

数据结构期末考试范围：
【重点内容】线性表、栈和队列、广义表的定义、串、树和二叉树（二叉树的遍历、线索二叉树的基本定义和遍历过程、二叉树与树及森林的转换、哈夫曼树）、图（图的领接矩阵、领接表存储结构，图的遍历算法、最小生成树、拓扑排序、最短路径）、查找（顺序查找、折半查找、二叉排序树的查找插入删除算法、平衡二叉树的基本概念、哈希表） 
【补充说明】教材目录中打标注的内容基本不涉及；二叉树的线索化算法及应用；有向图的强连通分量算法不要求；图中 AOE 及 AOV、关键路径不要求；红黑树不要求
【补充】栈与递归、KMP、B 树都在考试范围之内

本课程重点是后面的树、图、查找三章，同时务必要打好顺序表、栈和队列等前几章的数据结构的基础。我感觉很多同学对于数据结构考试的恐惧源于考试范围的未知性，我参考了历年 ds 和 dsa 这两门课的试卷，写一下重点复习的内容，希望可以帮到一些: 
哈夫曼树的构造和编码算法，树和森林的遍历和衍生算法，图的 BFS 和 DFs. 最小生成树的生成算法 (Prim 和 Krusca), 拓扑排序算法，单源最短路径的 Dijkstra 算法，(Floyd 今年不考，以后说不定)，(AOE 网的那个关键路径算法! Dsa 常考，但是 ds 好像近几年没考)，二叉排序树 (24 秋 dsa 考了)，二叉平衡树 (今年 ds 考了一个有关二叉平衡树 L 型单旋转平衡化的代码填空题，比较简单的就填了个修改 BalancefFaCtor，我挺害怕那个旋转的代码书写，事实证明应该不会考太难的，知道这个思想就行了). B-树和 B+树 (主要是那个结点分裂和合并的过程，这种就是不会让你直接写代码，但是你要掌握这个算法的，比如可以画出构造的过程)。哈希表的构建。几个小点: ASL 平均查找长度 (主要是哈希表里面)。WPL 带权路径长度 (hufman 树里面讲了)(这种给一个树你要会算，类似的比如说百接给你一个顺序表让你二分查找也要会这个算法的具体过程，给出一个输入可以求出查找次数)，前缀编码 (去年 6s 考了)，利用栈的逻辑结构进行前舞 (波兰式)、中缆、后缀表达式的转换 (今年没考但这个感觉要会)，(有同学间键树考不考，键树不考; 关节点和重连通那个小节不考; 线索二叉树的相关算法不考，但是逻辑结构存储结构要掌握哈 (比如间你先序/中序/后序线泰二叉树有几个中指针域)。免责声明: 以上仅仅为个人的想法，具体考试范围以当学期的老师表述为准，若有误差为正常情况，不保证能 cover 到所有考点，同时每年的范围也是动态的，请依具体情况而定。

# 树与二叉树

二叉树：一个节点只有两个孩子。
二叉树的存储：
- 顺序存储：数组下标表示位置。若数组从 1 开始，则第 i 个节点的孩子下标为 2i 和 2i+1；数组从 0 开始则孩子下标为 2i+1 和 2i+2。设置结构体数组 `tree[i]`
- 链式存储：使用两个指针。代码如下：
```cpp
struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(NULL), right(NULL) {}
};
```

## 二叉树算法

**递归三部曲：**
1. 确定递归函数的参数和返回值
2. 确定终止条件
3. 确定单层递归的逻辑

二叉树的递归遍历：
1. 设置函数：`void traversal(TreeNode* cur, vector<int>& vec)`。第一个参数传入当前树节点，第二个参数传入输出的结果
2. 设置终止条件：`cur == NULL` 时 return，并输出函数值
3. 前序：先取值，使用 `vec.push_back` 来增长数组，再遍历左子树，在遍历右子树。中序和后序同理

二叉树的迭代遍历：
1. 设置 `stack<TreeNode*> st` 节点栈
2. 前序：将根节点推入栈中。如果栈非空，弹出栈顶元素读值，**右左节点入栈**，空节点不入栈
3. 中序：如果栈非空且当前节点非空，则先循环访问到最底层，同时把数据放入栈中。如果空了，则弹出栈顶元素，访问栈顶元素，并访问栈顶的右节点。
   **统一迭代法**：空节点作为标记，右中 NULL 左入栈，遇到 NULL 先 pop 再访问再 pop。
4. 后序：由于先序遍历中左右，后序遍历左右中，则调换先序遍历的入栈顺序，并将结果反转，则可得到后续遍历。将根节点推入栈中。
   如果栈非空，弹出栈顶元素读值，左右节点入栈，空节点不入栈，最后**反转结果数组**。

二叉树的层序遍历：非递归
1. 设置队列 `queue<TreeNode*> que`，将 root push 进队列中
2. 若队列非空，弹出队列顶端节点并访问，把左孩子和右孩子依次放入队列中。

线索化二叉树：
1. 设置 Ltag，Rtag，若 Ltag=0 则指向左孩子，=1 则指向前驱。Rtag 同理。
2. 线索化：全局变量 pre=刚才访问过的节点，初始化为 NULL。中序遍历。节点左指针非空则置为 link，否则置为 thread，右指针同理。若 pre 存在，pre 右 tag 是线索，则 pre 右指针域指向 p。P 左 tag 是线索，p 左指针域指向 pre
3. 找中序前驱：最左下的节点 or 线索节点
4. 中序线索树必有两个指针为空。前序最右孩子右指针空，后序最左孩子左指针空，只有一个节点时有两个空指针

**DFS：深度优先遍历（先序）；BFS：广度优先遍历**
**广义上的后序遍历：先递归，后处理**

翻转二叉树：
1. 函数 `invertTree(TreeNode* root)`，返回值 `return *root`
2. 当 root 为 NULL 时递归终止直接返回 root 节点
3. 交换左孩子和右孩子，然后递归翻转左孩子和右孩子。

对称二叉树：迭代，后序遍历，左右中=右左中；队列
1. 设置函数 `bool compare(*left, *right)`
2. 终止条件：左节点 != 右节点，return false，若两节点都空则 return true
3. 单层遍历：两节点非空且都有值：若 `compare(*left->left, right->tight)` 且 `compare(*left->right, right->left)` 为真则返回真。

- 求二叉树最大深度=求二叉树高度，递归左右子树，取最大值+1
- 求二叉树最小深度：min（左右子树最小深度）。有坑：若左子树为空右子树非空则深度为 1+右子树最小深度，而不是 1！
- 求最近公共祖先：
	1. 函数 `TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q)`
	2. 终止条件：root = p 或 root = q 或 root = NULL 时返回 root
	3. 单层处理：后序遍历左子树，右子树的值存入 left，right。若都非空则该 root 就是最近公共祖先。若 left 是空则说明东西在右子树，返回 right 的值，right 是空则返回 left。
## 树和森林

1. 森林=>二叉树：先把根串起来，然后左孩子右兄弟
2. 二叉树=>森林：将 x 的右孩子，右孩子的右孩子全部与节点相连，并去掉双亲连线。

## 哈夫曼树

- 带权路径长度（WPL，Weighted Path Length）：$WPL=\sum_{i=1}^nw_{i}\times l_{i}$。哈夫曼树是二叉树中 WPL 最小的那个二叉树

构造哈夫曼树：
1. 若有 n 个节点，这是节点链表 `tree[2n]`，在 1-n 号位中填充节点。每一个节点有权值、父、左右孩子属性。初始父母左右孩子都是 0
2. 选取父节点不为 0，权值最小的两个节点（[[堆与优先队列]]实现），与新节点构建父子关联
3. 重复直到只剩一个节点

哈夫曼编码：前缀编码

## 平衡二叉树

又称为 AVL（ Adelson-Velsky and Landis）树。左右子树高度差不超过一
## 中序+后序重建二叉树代码解释

中序+后序重建二叉树思路
1. 使用 unordered_map 来保存中序遍历的节点值和序号，方便查找
2. 后序遍历最后一个元素是根节点，找到根节点的序号
3. 依照根节点序号 `i`，将元素分为 `left to i-1`、`i+1 to right`  两部分。并创建根节点。**函数返回根节点**
4. `root->left` 指向通过左子树构建的节点，右侧同理，递归下去
5. `right>left` ：返回 false。

中序+前序重建二叉树：前序序列第一个元素是根节点，其他照旧
核心原理：

| 遍历方式     | 顺序        | 特点               |
| -------- | --------- | ---------------- |
| **中序遍历** | 左 → 根 → 右 | 根节点把序列分成左右子树     |
| **后序遍历** | 左 → 右 → 根 | **最后一个元素一定是根节点** |

用例子说明：
假设有这棵树：
```
        A
       / \
      B   C
     / \   \
    D   E   F
```
- **中序遍历**: `[D, B, E, A, F, C]`
- **后序遍历**: `[D, E, B, F, C, A]`
算法步骤图解：

```
第1步：后序最后一个 = A (根节点)
中序: [D, B, E, A, F, C]
              ↑
           找到A的位置
       
左子树中序: [D, B, E]     右子树中序: [F, C]
左子树后序: [D, E, B]     右子树后序: [F, C]

第2步：递归处理左子树 [D, B, E]
后序最后一个 = B (左子树的根)
...以此类推
```

代码逐行解释

```cpp
BinaryTreeNode* BinaryTreeNode::buildTreeFromInorderPostorderHelper(
    const vector<string>& inorder, int inStart, int inEnd,      // 中序的范围
    const vector<string>& postorder, int postStart, int postEnd, // 后序的范围
    unordered_map<string, int>& inorderMap)                      // 快速查找用的映射
{
    // 1️⃣ 递归终止：范围无效时返回空
    if (postStart > postEnd || inStart > inEnd) {
        return nullptr;
    }

    // 2️⃣ 后序遍历的最后一个元素 = 当前子树的根
    string rootVal = postorder[postEnd];  // 例如第一次是 "A"
    BinaryTreeNode* root = new BinaryTreeNode();
    root->name = rootVal;

    // 3️⃣ 在中序遍历中找到根的位置，用于划分左右子树
    int inRoot = inorderMap[rootVal];  // "A" 在中序中的索引是 3
    int numsLeft = inRoot - inStart;   // 左子树节点数 = 3 - 0 = 3

    // 4️⃣ 递归构建左子树
    // 中序范围: [inStart, inRoot-1] → [0, 2] 即 [D, B, E]
    // 后序范围: [postStart, postStart+numsLeft-1] → [0, 2] 即 [D, E, B]
    root->left = buildTreeFromInorderPostorderHelper(
        inorder, inStart, inRoot - 1,
        postorder, postStart, postStart + numsLeft - 1,
        inorderMap);

    // 5️⃣ 递归构建右子树
    // 中序范围: [inRoot+1, inEnd] → [4, 5] 即 [F, C]
    // 后序范围: [postStart+numsLeft, postEnd-1] → [3, 4] 即 [F, C]
    root->right = buildTreeFromInorderPostorderHelper(
        inorder, inRoot + 1, inEnd,
        postorder, postStart + numsLeft, postEnd - 1,
        inorderMap);

    return root;
}
```

1. **后序末尾找根** - [postorder[postEnd]](vscode-file://vscode-app/d:/Program%20Files%20\(x86\)/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-browser/workbench/workbench. Html) 就是根
2. **中序定左右** - 根在中序中的位置把序列分成左右两部分
3. **计算左子树大小** - [numsLeft = inRoot - inStart](vscode-file://vscode-app/d:/Program%20Files%20\(x86\)/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-browser/workbench/workbench.html)，这个数字用来划分后序序列
4. **递归处理** - 对左右子树分别递归，缩小范围

[inorderMap](vscode-file://vscode-app/d:/Program%20Files%20\(x86\)/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-browser/workbench/workbench.html) 的作用是把 O (n) 的查找变成 O (1)，提高效率。
# 图算法

图：G（V, E），每个节点有度。有向图和无向图。图有连通分量。有向图有强联通分量。
图的存储：设 A 存储图，
- 邻接矩阵：`A.edge[n][m]` 代表有 n 到 m 的边。`A.vertex[n]` 数组存储图的节点。无向图对称
- 邻接表：`A.vec[n]`。头节点存储节点编号（data）、第一条边的指针（firstarc）。表节点存储邻接节点编号（adjvex）、下一邻接节点的指针（nextarc）。O (n+2e)。有向图用出边搞邻接表，入边搞逆邻接表。
- 十字链表：每个节点有 in 和 out 两指针。横向是出度的邻接表，纵向是入度的邻接表

## 图的遍历

回溯法：暴力搜索问题，遇到不对的状态或成功完成任务就回溯
1. 确认递归函数和参数
2. 确认终止条件和返回值：if ()，存放结果，return
3. 处理目前搜索节点出发的路径：for 剩余节点：处理节点、bfs、**撤销当前步骤**

深度优先搜索：DFS。如何用深度优先搜索出所有可达路径？
1. `void dfs (const vector<vector<int>>& graph, int x, int n)`，输入邻接矩阵，n 是终点，x 是目前遍历的点。二维数组存放所有路径 `vector<vector<int>> result`
2. 确认终止条件：当 x=n 时终止，路径 push_back 到二维数组
3. 处理目前搜索节点：遍历邻接矩阵第 x 行。如果 `edge[x][i] == 1`，则路径中添加该节点 `path.push_back(i)`，深度优先遍历 dfs (i)，再撤销改变 `path.pop_back`。
- 边的分类：树边、后向边、前向边、横向边

广度优先搜索：BFS。队列实现。跳过红父节点的访问
岛屿数量遍历：对于 $n\times n$ 方格 `grid[n][n]`，建立数组 ` visited[n][n]`。遍历方格，对于一个没有访问过的陆地，计数器+1，并将该陆地周围全部遍历一遍；访问过的陆地和海洋直接跳过。

拓扑排序：选取入度为 0 的节点，记录并删除，递归直到没有节点
## 最小生成树

最小生成树：建立 n-1 条边把图连起来
- Prim 算法：维护节点的集合
	1. 维护 minDist 数组，为剩余节点到最小生成树的最短距离。选择距离生成树最近的节点
	2. 最近节点加入生成树
	3. 更新 minDist 数组：
- Kruskal 算法：维护边的集合
	1. 排序边的权值
	2. 遍历排序后的边，若边首尾不在一个集合则加入，首尾在一个集合则忽略。使用并查集：
		1. 初始化 `father[i]=i`
		2. Find 函数与路径压缩：`return u == father[u] ? u : father[u] = find(father[u]);`
		3. Union 函数与按秩（树的高度）堆叠：小的放在大的下面

## 单源最短路径

Dijkstra：源到目标点的最短路径。与 prim 类似：$O(E\log V)$ 或者 $O(V^2)$，未优化前：
1. 维护 minDist 和 visited 两个数组，选距离原点最近的未访问的节点（这一步可以用堆来优化）
2. 标记该节点已访问过
3. 从该节点出发遍历所有邻接边，更新未访问节点到源点的距离

Bellman-ford 算法：源到目标点最短路径：$O(EV)$
1. 创建 `dist[]` 距离数组，源点距离为 0，其余为无穷大。数组长度为 V
2. 循环 V-1 次。每次循环中都遍历 E 条边，每条边有权值 w (u, v)：如果 `dist[u] + w(u,v) < dist[v]`，则更新 `dist[v] = dist[u] + w(u,v) `。
3. 负环检测：在第 V 次循环时，若发现还有节点被更新，则存在负环，将所有距离设为-1.

上述算法在[[计网U5-控制平面]]中用于选路。
A*

## 所有节点对最短路径

Floyd：`grid[i][j][k] = min(grid[i][k][k - 1] + grid[k][j][k - 1]， grid[i][j][k - 1])`


## 最大流
最大流最小切割定理：网络最大值=最小切割的容量
Ford-fulkson 方法：
1. 初始化流 f 为 0
2. 构建残存网络：前向边（残存容量 c-f）、反向边（可以反向流量 f）
3. 寻找增广路径：找到 s 到 t 的简单路径，找到瓶颈容量
4. 更新流量
5. 重复，直到残存网络找不到 s 到 t 的路径

Edmonds-Karp 算法：规定使用 FF 方法时，必须使用 BFS 来寻找增广路径。复杂度 $O(VE^2)$。

# 字符串算法

KMP 算法：模式串匹配，搜索指针一直向右。Next 数组表示当前位置字符串最大相等前后缀长度。T 代表字符串，P 代表模式串
1. 预处理，计算 Next 数组：
	- 初始化两个指针： i 指针：字符串第 i 位；j 指针：匹配成功的相等前后缀长度；字符串 P
	- 状态转移：初始化 `next[0]=0`，然后
		- `j=0`：没有相等前后缀长度 `next[i]=0, i++`
		- `P[i]=P[j]`：匹配成功。这一位前后缀相等，向后移动且+1 `j++, next[i]=j, i++`
		- `P[i]!=P[j] and j!=0`：匹配失败。I 不变，`j=next[j-1]` 
2. 匹配字符串：
	- 初始化两个指针：i 指针：字符串；j 指针：模式串
	- 若 `T[i] = P[j]`：两端都加。 `i++ , j++`
	- 若不等，如果 `j>0`, 则 j 回退到 `next[j]`，如果 `j=0`，则 i++，比较下一位