import React from "react";
import { Button, Result } from "antd";
import { Link, useParams } from "react-router-dom";

const ErrorHandlePage = () => {
  const { _id } = useParams();
  console.log(_id)

  return (
    <div className="error-page-container" style={{ background: 'white', height: '100vh' }}>
      <Result status="404" title="404" subTitle="Sorry, Page not found!" extra={<Button type="primary"><Link to={`/dashboard`}>Back Home</Link>   </Button>} />
    </div>
  );
};

export default ErrorHandlePage;
