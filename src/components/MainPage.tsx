import React, { useState } from 'react';
import { Input, Table, Layout, Checkbox, Button, Modal, Typography } from 'antd';
import useSWR from 'swr';
import type { ColumnsType } from 'antd/es/table';
import { DeleteOutlined, RobotOutlined, DownOutlined, RightOutlined, RedoOutlined } from '@ant-design/icons';
const { Content, Header } = Layout;
const { Title } = Typography;

export type Todo = {
  key: number;
  task: string;
  completed: boolean;
  isConcept: boolean;
  todoKey?: number;
  parentTodoId?: number;
  parentTodo?: Todo;
  subtodos: Todo[];
};

const fetcher = (url: string, options?: RequestInit) =>
  fetch(`http://localhost:3000${url}`, options).then(res => res.json());

const MainPage: React.FC = () => {
  const { data: todos, mutate: mutateTodos } = useSWR<Todo[]>('/todos', fetcher);
  const [inputValue, setInputValue] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [rerunQuerytext, setRerunQuerytext] = useState('');
  const [generating, setGenerating] = useState<{ [key: number]: boolean }>()
  const [selectedSubtodo, setSelectedSubtodo] = useState<Todo | null>(null);

  const handleAddTodo = async () => {
    if (inputValue.trim()) {
      await fetch('http://localhost:3000/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task: inputValue, completed: false }),
      });
      setInputValue('');
      mutateTodos();
    }
  };

  const handleToggleComplete = async (key: number) => {
    await fetch(`http://localhost:3000/todos/${key}`, {
      method: 'PUT',
    });
    mutateTodos();
  };

  const handleDeleteTodo = async (key: number) => {
    await fetch(`http://localhost:3000/todos/${key}`, {
      method: 'DELETE',
    });
    mutateTodos();
  };

  const handleGenerateSubTodos = async (key: number) => {
    setGenerating(prev => ({ ...prev, [key]: true }));
    await fetch(`http://localhost:3000/todos/generate-subtodos/${key}`, {
      method: 'PUT',
    });
    setGenerating(prev => ({ ...prev, [key]: false }));
    mutateTodos();
  };

  const handleRerunSubtodo = (subtodo: Todo) => {
    setSelectedSubtodo(subtodo);
    setModalVisible(true);
  };

  const handleUpdateSubtodo = async () => {
    if (selectedSubtodo && rerunQuerytext.trim()) {
      await fetch(`http://localhost:3000/todos/rerun-subtodo/${selectedSubtodo.key}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rerunQuerytext,
        }),
      });
      setModalVisible(false);
      setRerunQuerytext('');
      mutateTodos();
    }
  };

  const TodoRow: React.FC<{ todo: Todo }> = ({ todo }) => {
    const isSubtodo = !!todo.parentTodoId;
    const lastUpdated = selectedSubtodo?.key === todo.key
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0'}}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Checkbox checked={todo.completed} onChange={() => handleToggleComplete(todo.key)} />
          <span style={{
            marginLeft: '8px',
            textDecoration: todo.completed ? 'line-through' : 'none',
            color: lastUpdated ? 'blue' : (todo.completed ? 'gray' : 'inherit'),
          }}>
  {todo.task}
</span>
        </div>
        <div>
          {isSubtodo ? (
            <>    <Button
              type="link"
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteTodo(todo.key)}
              title="Delete this item"
            />
            <Button
              type="link"
              icon={<RedoOutlined />}
              onClick={() => handleRerunSubtodo(todo)}
              title="Rerun this subtask"
            />
            </>
          ) : (
            <>
              <Button
                type="link"
                icon={<DeleteOutlined />}
                onClick={() => handleDeleteTodo(todo.key)}
                title="Delete this item"
              />
              <Button
                type="link"
                icon={<RobotOutlined />}
                onClick={() => handleGenerateSubTodos(todo.key)}
                loading={generating?.[todo.key] || false}
                title="Generate sub-tasks"
              />
            </>
          )}
        </div>
      </div>
    );
  };

  const columns: ColumnsType<Todo> = [
    {
      title: 'Todos',
      dataIndex: 'completed',
      key: 'completed',
      render: (_, record) => <TodoRow todo={record} />
    },
  ];

  const expandedRowRender = (record: Todo) => (
    <Table
      dataSource={record.subtodos.sort((a, b) => a.key - b.key)}
      columns={columns}
      pagination={false}
      showHeader={false}
      rowKey="key"
    />
  );

  return (
    <>
      <Modal
        title="Tell us what to change with this todo"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleUpdateSubtodo}
        okText="Update"
        cancelText="Cancel"
      >
        <Input.TextArea
          placeholder="Enter your text here"
          value={rerunQuerytext}
          onChange={(e) => setRerunQuerytext(e.target.value)}
          rows={4}
        />
      </Modal>
      <Layout style={{ minHeight: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f2f5' }}>
        <Header style={{ backgroundColor: '#001529', width: '100%', textAlign: 'center', padding: '20px 0' }}>
          <Title level={2} style={{ color: '#fff', margin: 0 }}>Todo List Generator</Title>
        </Header>
        <Content style={{ width: '50%', marginTop: '20px', backgroundColor: '#fff', padding: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
          <Input
            placeholder="Add a new todo"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onPressEnter={handleAddTodo}
            style={{ marginBottom: '20px' }}
          />
          <Table
            dataSource={todos}
            columns={columns}
            pagination={false}
            style={{ width: '100%', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
            expandable={{
              expandedRowRender,
              rowExpandable: (record) => Array.isArray(record.subtodos) && record.subtodos.length > 0,
              expandIcon: ({ expanded, onExpand, record }) =>
                (Array.isArray(record.subtodos) && record.subtodos.length > 0)?
                  expanded ? (
                    <DownOutlined onClick={e => onExpand(record, e)} />
                  ) : (
                    <RightOutlined onClick={e => onExpand(record, e)} />
                  ): <></>,
            }}
          />
        </Content>
      </Layout>
    </>
  );
};

export default MainPage;