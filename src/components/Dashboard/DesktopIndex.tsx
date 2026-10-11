import {
  DesktopIndexBoxTextStyle1,
  DesktopIndexBoxSurfaceStyle2,
  DesktopIndexBoxLayoutStyle3,
  DesktopIndexBoxSurfaceStyle4,
  DesktopIndexTypographyTextStyle5,
  DesktopIndexBoxSizeStyle6,
  DesktopIndexButtonBaseSurfaceStyle7,
  DesktopIndexTypographyTextStyle8,
  DesktopIndexBoxLayoutStyle9,
  DesktopIndexBoxSizeStyle10,
  DesktopIndexAvatarTextStyle11,
  DesktopIndexBoxSizeStyle12,
  DesktopIndexTypographySizeStyle13,
  DesktopIndexTypographyTextStyle14,
  DesktopIndexButtonBaseSurfaceStyle15,
  DesktopIndexTypographyTextStyle16,
  DesktopIndexBoxSizeStyle17
} from "../Styles/Dashboard/DesktopIndex/DesktopIndex.styles";
import { useEffect, useState } from "react";
import { Avatar, Box, ButtonBase, Typography } from "@mui/material";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CalendarCheck2, LayoutDashboard, LogOut } from "lucide-react";

import type { RootState } from "../../store/store";
import { getUserData } from "../../api/auth/auth";
import { setAuthData } from "../../reducer/AuthSlice";
import AvatarIcon from "../../assets/Icons/Avatar.svg";
import SignOutComponent from "../Auth/SignOut";

export default function DesktopIndex() {
  const [signOutOpen, setSignOutOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { authData } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchUser = async () => {
      const result = await getUserData();
      if (result?.status === 200) {
        dispatch(setAuthData(result.data));
      }
    };

    void fetchUser();
  }, [dispatch]);

  const navItems = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard size={19} />,
      selected: location.pathname === "/",
      onClick: () => navigate("/"),
    },
  ];

  return (
    <>
      <SignOutComponent
        open={signOutOpen}
        handleCancel={() => setSignOutOpen(false)}
      />

      <Box
        sx={DesktopIndexBoxTextStyle1}
      >
        <Box
          component="header"
          sx={DesktopIndexBoxSurfaceStyle2}
        >
          <Box sx={DesktopIndexBoxLayoutStyle3}>
            <Box
              sx={DesktopIndexBoxSurfaceStyle4}
            >
              <CalendarCheck2 size={21} strokeWidth={2.2} />
            </Box>
            <Typography
              variant="h6"
              sx={DesktopIndexTypographyTextStyle5}
            >
              TaskFlow
            </Typography>
          </Box>

          <Box
            component="nav"
            aria-label="Main navigation"
            sx={DesktopIndexBoxSizeStyle6}
          >
            {navItems.map((item) => (
              <ButtonBase
                key={item.label}
                onClick={item.onClick}
                aria-current={item.selected ? "page" : undefined}
                sx={DesktopIndexButtonBaseSurfaceStyle7({ item: item })}
              >
                {item.icon}
                <Typography variant="body2" sx={DesktopIndexTypographyTextStyle8({ item: item })}>
                  {item.label}
                </Typography>
              </ButtonBase>
            ))}
          </Box>

          <Box sx={DesktopIndexBoxLayoutStyle9}>
            <Box sx={DesktopIndexBoxSizeStyle10}>
              <Avatar
                src={AvatarIcon}
                alt=""
                sx={DesktopIndexAvatarTextStyle11}
              />
              <Box sx={DesktopIndexBoxSizeStyle12}>
                <Typography variant="caption" color="text.secondary" sx={DesktopIndexTypographySizeStyle13}>
                  Signed in as
                </Typography>
                <Typography
                  variant="body2"
                  sx={DesktopIndexTypographyTextStyle14}
                >
                  {authData?.username || "User"}
                </Typography>
              </Box>
            </Box>
            <ButtonBase
              onClick={() => setSignOutOpen(true)}
              sx={DesktopIndexButtonBaseSurfaceStyle15}
            >
              <LogOut size={18} />
              <Typography variant="body2" sx={DesktopIndexTypographyTextStyle16}>
                Sign out
              </Typography>
            </ButtonBase>
          </Box>
        </Box>

        <Box
          component="main"
          sx={DesktopIndexBoxSizeStyle17}
        >
          <Outlet />
        </Box>
      </Box>
    </>
  );
}
