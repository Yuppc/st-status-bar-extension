// 扩展信息
export const name = 'Dynamic Status Bar';
export const description = '一个基于黑化值动态切换的角色状态栏扩展';

// 全局状态变量
let isExtensionEnabled = false;

// 初始化角色变量
function initializeCharacterVariables() {
  if (typeof state.character !== 'undefined') {
    // 不再设置初始值，将根据开场白或其他逻辑来确定状态
    if (typeof state.character.黑化值 === 'undefined') {
      state.character.黑化值 = 0; // 角色黑化值
      state.character.黑化阈值 = 80; // 黑化阈值
    }
  }
}

// 生成状态栏的函数
function generateStatusBar() {
  initializeCharacterVariables();
  
  // 如果黑化值大于等于80，生成黑化状态栏
  if (state.character.黑化值 >= state.character.黑化阈值) {
    return `(黑化状态：请在回复末尾添加以下内容：

名字: {{char}}
当前服饰: ？？？
当前动作: ？？？
情绪: ？？？
理智值: ？？？
好感度: ？？？
黑化值: {{char.黑化值}}/100
当前想法: ？？？
想做的事: ？？？
阴暗想法: 
请根据当前对话内容和角色性格生成5句不超过10字的阴暗想法，用分号分隔)
`;
  } else {
    // 否则生成正常状态栏
    return `(正常状态：请在回复末尾添加以下内容：

名字: {{char}}
当前服饰: {{char.当前服饰}}
当前动作: {{char.当前动作}}
情绪: {{char.情绪}}
理智值: {{char.理智值}}/100
好感度: {{char.好感度}}/100
黑化值: {{char.黑化值}}/100
当前想法: {{char.当前想法}}
想做的事: {{char.想做的事})
`;
  }
}

// 更新黑化值的函数
function updateDarknessValue(amount) {
  initializeCharacterVariables();
  
  // 更新黑化值
  state.character.黑化值 = Math.max(0, Math.min(100, state.character.黑化值 + amount));
  
  // 返回更新后的状态
  return `黑化值${amount >= 0 ? '增加' : '减少'}了${Math.abs(amount)}点，当前为${state.character.黑化值}点`;
}

// 添加正则规则
function addRegexRule() {
  if (window.addCustomSubstitution) {
    window.addCustomSubstitution('StatusBarRule', {
      findRegex: '([\\s\\S]*)$',
      replaceWith: '$1\n\n{{generateStatusBar()}}',
      isEnabled: true
    });
  }
}

// 移除正则规则
function removeRegexRule() {
  if (window.deleteCustomSubstitution) {
    window.deleteCustomSubstitution('StatusBarRule');
  }
}

// 初始化扩展
export function init() {
  const extensionName = name;
  
  // 添加扩展按钮
  const buttonHTML = `
    <div id="dynamic-status-bar-button" class="list-group-item flex-container">
      <div class="flex-container">
        <input id="dynamic-status-bar-enabled" type="checkbox" class="checkbox">
        <label for="dynamic-status-bar-enabled" class="checkbox-label"></label>
      </div>
      <div class="flex_content">${extensionName}</div>
    </div>
  `;
  
  $('#extensions_settings').append(buttonHTML);
  
  // 添加事件监听
  $('#dynamic-status-bar-enabled').on('change', function() {
    isExtensionEnabled = $(this).prop('checked');
    if (isExtensionEnabled) {
      addRegexRule(); // 启用扩展时添加正则规则
      console.log('Dynamic Status Bar extension enabled');
    } else {
      removeRegexRule(); // 禁用扩展时移除正则规则
      console.log('Dynamic Status Bar extension disabled');
    }
  });
  
  // 注册自定义函数到全局作用域
  window.initializeCharacterVariables = initializeCharacterVariables;
  window.generateStatusBar = generateStatusBar;
  window.updateDarknessValue = updateDarknessValue;
  
  console.log('Dynamic Status Bar extension initialized');
}
