import {
  BrowserRouter
} from "react-router-dom";
import Routes from './routes';

import 'font-awesome/css/font-awesome.css';
import 'antd/dist/reset.css';
import { ConfigProvider, ThemeConfig } from "antd";
import { StrictMode } from "react";

// Approximate Old School RuneScape theme colors:
// - primary: deep rune-scaping red
// - goldAccent: ornamental gold used for highlights (not a token, shown here as comment)
// - dark layout background and parchment-like container background for content
const theme: ThemeConfig = {
  token: {
    colorPrimary: '#8B1E1E', // deep red
    colorBgLayout: '#0f0c09', // dark site background
    colorBgContainer: '#f7efe0', // parchment-like content background
    colorText: '#000000', // pale text for dark areas
  },
  components: {
    Layout: {
      headerBg: '#2b160f',
      headerPadding: '0 10px',
      bodyBg: '#f7efe0',
    }
  }
}

export const App = () => {
  return (
    <StrictMode>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <ConfigProvider theme={theme}>
          <Routes />
        </ConfigProvider>
      </BrowserRouter>
    </StrictMode>
  )
};