import React from "react";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

// Pages
import MainPage from "./page/MainPage";
import PostWritePage from "./page/PostWritePage";
import PostViewPage from "./page/PostViewPage";

// 순서대로 메인 (Read All) 페이지, Read 페이지, Create 페이지, Update 페이지
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element = {<MainPage/>}/>
        <Route path="post/:postId" element={<PostViewPage />} />
        <Route path="post-write" element={<PostWritePage/>}/>
        <Route path="post-write/:postId" element={<PostWritePage />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
