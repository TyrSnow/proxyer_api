# Core
基于express封装了部分方便开发的小功能块。
# 版本更新
### Ver 0.1.0
TODO:
1. [check] 取消injector文件夹，拆分成controller、service、ioc
2. [check] 允许controller目录存在子目录，没有指定controller的path的情况下，自动使用子目录路径做为前缀路径
3. [check] 允许controller整体使用middleware
4. 每个请求有一个单独的 this，并包含 req 和 res 对象
5. 允许为service方法添加log修饰符，自动打印调用参数
6. [check] 取消loader文件夹，与controller文件夹合并
7. [check] 取消response文件夹，功能放于helper中 [这个功能需要core提供吗？]
8. [check] 增减application，并提供默认项目配置
