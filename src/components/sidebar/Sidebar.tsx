import { useLocation, useNavigate } from "react-router-dom";
import { Menu } from 'antd';
import { routeUrls } from "../../routes";

import './sidebar.css'
import { ItemType, MenuItemType } from "antd/es/menu/interface";
import { FileOutlined, AimOutlined, HomeOutlined, MinusCircleOutlined } from "@ant-design/icons";


export const SideBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const items: ItemType<MenuItemType>[] = [
    {
      key: routeUrls.home,
      label: "Home",
      onClick: () => navigate(routeUrls.home),
      icon: <HomeOutlined />,
    },
    {
      key: routeUrls.cerberus,
      label: "Cerberus",
      onClick: () => navigate(routeUrls.cerberus),
      icon: <AimOutlined />,
    },
    {
      key: routeUrls.araxxor,
      label: "Araxxor",
      onClick: () => navigate(routeUrls.araxxor),
      icon: <FileOutlined />,
    },
    {
      key: '/notfound', // demo 404
      label: "Not Found",
      onClick: () => navigate("/notfound"),
      icon: <MinusCircleOutlined />
    }
  ]

  return (
    <div className="sidebar">
      <div className="padding-md text-center selectness border-normal">
        <h1 className="sidebar-title">OSRS Boss Helper</h1>
      </div>

      <Menu
        theme="light"
        selectedKeys={[`${location.pathname}`]}
        mode="inline"
        className="padding-top-lg"
        items={items}
      />;
    </div>
  );
}

export default SideBar;