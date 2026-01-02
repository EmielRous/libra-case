import React from 'react';
import useSWR from "swr";

const fetcher = (url: string, options?: RequestInit) =>
  fetch(`http://localhost:3000${url}`, options).then(res => res.json());

const MainPage: React.FC = () => {
  const { data, error, isLoading } = useSWR('/hello', fetcher)

  return <div><h1>Welcome to React with TypeScript</h1>
    <p>{data?.data}</p>
    <p>{JSON.stringify(isLoading)}</p>
  </div>;
};

export default MainPage;