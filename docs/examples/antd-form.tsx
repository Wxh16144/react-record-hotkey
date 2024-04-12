import { Button, Form, Space, Typography } from 'antd';
import RecordShortcutInput from 'antd-record-hotkey-input';
import type { RuleRender } from 'antd/es/form';
import { useEffect, useState } from 'react';
import userShortcuts from './user-shortcuts.json';

const checkShortcutKeyConflict: RuleRender = ({ getFieldsValue }) => ({
  validator: ({ field }: any, value) => {
    const otherShortcuts = Object.entries(getFieldsValue()).filter(([k]) => k !== field);
    if (value && otherShortcuts.some(([, v]) => v === value)) {
      return Promise.reject(
        new Error(navigator?.language?.startsWith('zh') ? '快捷键冲突' : 'Shortcut key conflict'),
      );
    }
    return Promise.resolve();
  },
});

const initShortcuts = userShortcuts.reduce((acc, { field, value }) => {
  const shortcut = typeof value === 'string' ? value : '';
  acc[field] = shortcut.replace(/\s/g, '');
  return acc;
}, {} as any);

const App = () => {
  const [form] = Form.useForm();
  const [usefulShortcuts, updateUsefulShortcuts] = useState(initShortcuts);
  const watchedAllShortcuts = Form.useWatch([], form);

  useEffect(() => {
    form.validateFields();
  }, [watchedAllShortcuts, form]);

  return (
    <>
      <Form
        name="shortcuts"
        form={form}
        initialValues={initShortcuts}
        onFinish={updateUsefulShortcuts}
        labelCol={{ span: 4 }}
      >
        {userShortcuts.map(({ label, field }) => (
          <Form.Item
            key={field}
            name={field}
            label={label}
            rules={[checkShortcutKeyConflict]}
            validateTrigger="onConfirm"
            getValueFromEvent={(v) => `${v || ''}`.replace(/\s/g, '')}
          >
            <RecordShortcutInput allowClear style={{ width: 320 }} />
          </Form.Item>
        ))}
      </Form>

      <Space>
        <Button onClick={() => form.submit()} htmlType="submit" type="primary">
          Submit
        </Button>

        <Button danger onClick={() => form.resetFields()}>
          Reset
        </Button>
      </Space>

      <Typography.Paragraph>
        <pre>{JSON.stringify(usefulShortcuts, null, 2)}</pre>
      </Typography.Paragraph>
    </>
  );
};

export default App;
