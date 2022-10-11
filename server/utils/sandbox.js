const Safeify = require('safeify').default;

module.exports = async function sandboxFn(context, script) {
    // 创建 safeify 实例
    const safeVm = new Safeify({
        timeout: 3000,
        asyncTimeout: 60000,
        // quantity: 4,          //沙箱进程数量，默认同 CPU 核数
        // memoryQuota: 500,     //沙箱最大能使用的内存（单位 m），默认 500m
        // cpuQuota: 0.5,
        // true为不受CPU限制，以解决Docker启动问题
        unrestricted: true,
        unsafe: {
            modules: {
              // 引入assert断言库
                assert: 'assert'
            }
        }
    });

    safeVm.preset('const assert = require("assert");');

    script += "; return this;";
    // 执行动态代码
    const result = await safeVm.run(script, context);

    // 释放资源
    safeVm.destroy();
    return result
};