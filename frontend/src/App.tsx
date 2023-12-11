import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import React from "react";
import AlbumPage from "./AlbumPage";
import UploadForm from "./UploadForm";

const theme = createTheme({
  palette: {
    primary: {
      main:  "#43a047",
    }
  },
});

export default function App() {
  return (
    <React.Fragment>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <BrowserRouter>
        <Routes>
          <Route path="/refsite" element={<AlbumPage/>}/>
          <Route path="/refsite/karani" element={<AlbumPage defaultFilter="karani"/>}/>
          <Route path="/refsite/upload" element={<UploadForm/>}/>
        </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </React.Fragment>
  );
}