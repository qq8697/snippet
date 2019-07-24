# 我该如何使用mark2web？

## 项目结构
如下所示：

    index.html
    sidebar.md
    README.md
	js/
	css/
    docs/  # insert markdown files here
		images/	# set image files here
	favicon.ico

**NOTE**: 如果使用 [Github Pages][Github Pages] 部署，请将整个文件结构置于 `gh-pages` 分支下；如果使用自己的主机部署，并用 [nginx][nginx] 或 [apache][apache] 做服务器，请将 `root` 指向项目根目录。  
» 点击下载 [项目压缩包][project]

## index.html
[Download][index_file] (<- 右键 "另存为") 或者将如下代码拷贝保存为 `index.html`
：

    <!DOCTYPE html>
	<html>
	<head>
	    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	    <title>mark2web</title>
	    <link rel="icon" href="/favicon.ico" type="image/x-icon">
	
	    <!-- jquery -->
	    <script src="js/jquery-1.11.0.min.js"></script>
	
	    <!-- marked -->
	    <script src="js/marked.js"></script>
	
	    <!-- highlight -->
	    <link rel="stylesheet" href="css/github.css">
	    <script src="js/highlight.js"></script>
	
	    <!-- store -->
	    <script src="js/store.js"></script>
	
	    <!-- mark2web -->
	    <link rel="stylesheet" href="css/mark2web.css">
	    <script src="js/mark2web.js"></script>
	</head>
	<body>
	    <!-- dom element -->
	    <div id="sidebar"></div>
	    <div id="content"></div>
	    <div id="loading">Loading ...</div>
	    <div id="error">Opps! ... File not found!</div>
	
	    <!-- display element -->
	    <div id="back_to_top">top</div>
	    <div id="flip">
	      <div id="pageup">pre</div>
	      <div id="pagedown">next</div>
	    </div>
	    <div id="progress"></div>
	    
	    <script>
	        $(function($) {
	          // settings
	          mark2web.index = "README.md";
	          mark2web.sidebar_file = "sidebar.md";
	          mark2web.document_title = 'mark2web';
	
	          // run
	          mark2web.run();
	        });
	    </script>
	</body>
	</html>

## sidebar.md
在 `sidebar.md` 文件中创建你想要列出的文档和链接，格式如下：

    #docs/file_name_without_extension

For example:

	- [是如何工作的？](#docs/how_does_it_work)
	- [为什么用？](#docs/why_use_mark2web)

**NOTE**：木有后缀名，么有后缀名，没有后缀名。

## README.md & docs/some_doc.md
You can put anything in here as you see fit.


[Github Pages]: https://pages.github.com/
[nginx]:https://nginx.org/
[apache]:http://www.apache.org/
[index_file]:https://github.com/qq8697/mark2web/blob/gh-pages/index.html
[project]:https://github.com/qq8697/mark2web/archive/gh-pages.zip
