describe('首页最小示例', () => {
  it('首页标题', () => {
    cy.visit('/');

    cy.contains('React Record Hotkey');
  });

  it('正常工作', () => {
    // 也可以直接用 dumi 的 demo url: cy.visit('/~demos/docs-demo-0'');
    cy.visit('/');

    // 等待
    cy.wait(1000);

    // 首页有个输入框
    cy.get('.ant-record-hotkey-input').should('exist');

    cy.get('.ant-record-hotkey-input').as('input');

    // 双击输入框进入编辑模式
    cy.get('@input').dblclick();
    cy.get('@input').should('have.class', 'ant-record-hotkey-input-recording');

    // 按下 shift + a
    cy.get('@input').trigger('keydown', { keyCode: 16, shiftKey: true, code: 'ShiftLeft' });
    cy.get('@input').trigger('keydown', { keyCode: 65, shiftKey: true, code: 'KeyA' });

    // 按下回车结束录制
    cy.get('@input').trigger('keydown', { keyCode: 13, code: 'Enter' });

    cy.wait(300);

    // 断言输入框有内容
    cy.get('@input').find('input').should('have.value', 'Shift + A');
  });

  it('点击编辑按钮进入编辑状态', () => {
    cy.visit('/');

    cy.wait(1000);

    cy.get('.ant-record-hotkey-input').as('input').should('exist');

    cy.get('@input').find('button').as('editButton').should('exist');

    // 点击编辑按钮
    cy.get('@editButton').click();

    cy.wait(300);

    // 断言输入框进入编辑状态
    cy.get('@input').should('have.class', 'ant-record-hotkey-input-recording');
  });

  it('输入回车进入编辑状态并且正常完成录制', () => {
    cy.visit('/');

    cy.wait(1000);

    cy.get('.ant-record-hotkey-input').as('input').should('exist');

    // 输入回车
    cy.get('@input').trigger('keydown', { keyCode: 13, code: 'Enter' });

    cy.wait(300);

    // 断言输入框进入编辑状态
    cy.get('@input').should('have.class', 'ant-record-hotkey-input-recording');

    // 录制快捷键
    cy.get('@input').trigger('keydown', { keyCode: 16, shiftKey: true, code: 'ShiftLeft' });
    cy.get('@input').trigger('keydown', { keyCode: 65, shiftKey: true, code: 'KeyA' });
    cy.get('@input').trigger('keydown', { keyCode: 13, code: 'Enter' });

    cy.wait(300);

    // 断言输入框有内容
    cy.get('@input').find('input').should('have.value', 'Shift + A');
  });
});
