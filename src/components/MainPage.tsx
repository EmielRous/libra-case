import React, { useState } from 'react';
import { Input, Table, Layout, Checkbox, Button } from 'antd';
import useSWR from 'swr';
import type { ColumnsType } from 'antd/es/table';

const { Content } = Layout;

const fetcher = (url: string, options?: RequestInit) =>
  fetch(`http://localhost:3000${url}`, options).then(res => res.json());

interface Todo {
  key: number;
  task: string;
  completed: boolean;
}

const MainPage: React.FC = () => {
  const { data: todos, mutate: mutateTodos } = useSWR<Todo[]>('/todos', fetcher);
  const [inputValue, setInputValue] = useState('');

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

  const columns: ColumnsType<Todo> = [
    {
      title: 'Completed',
      dataIndex: 'completed',
      key: 'completed',
      render: (_, record) => (
        <Checkbox checked={record.completed} onChange={() => handleToggleComplete(record.key)} />
      ),
    },
    {
      title: 'Task',
      dataIndex: 'task',
      key: 'task',
      render: (text, record) => (
        <span style={{ textDecoration: record.completed ? 'line-through' : 'none', color: record.completed ? 'gray' : 'inherit' }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button type="link" onClick={() => handleDeleteTodo(record.key)}>
          Delete
        </Button>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', justifyContent: 'center', alignItems: 'center' }}>
      <Content style={{ width: '50%' }}>
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
          style={{ width: '100%' }}
        />
      </Content>
    </Layout>
  );
};

export default MainPage;