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
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100vh",
          minHeight: 0,
          overflow: "hidden",
          bgcolor: "#f6f8fb",
        }}
      >
        <Box
          component="header"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 1.5, sm: 3 },
            width: "100%",
            minHeight: 76,
            boxSizing: "border-box",
            px: { xs: 2, md: 3.5 },
            py: 1.25,
            bgcolor: "#fff",
            borderBottom: "1px solid",
            borderColor: "divider",
            zIndex: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, flexShrink: 0 }}>
            <Box
              sx={{
                width: 38,
                height: 38,
                display: "grid",
                placeItems: "center",
                borderRadius: 2,
                bgcolor: "primary.main",
                color: "primary.contrastText",
              }}
            >
              <CalendarCheck2 size={21} strokeWidth={2.2} />
            </Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 750, letterSpacing: -0.4, color: "text.primary" }}
            >
              TaskFlow
            </Typography>
          </Box>

          <Box
            component="nav"
            aria-label="Main navigation"
            sx={{ display: "flex", alignItems: "center", flex: 1, minWidth: 0, ml: { xs: 0, sm: 2 } }}
          >
            {navItems.map((item) => (
              <ButtonBase
                key={item.label}
                onClick={item.onClick}
                aria-current={item.selected ? "page" : undefined}
                sx={{
                  minHeight: 42,
                  justifyContent: "flex-start",
                  gap: 1,
                  px: 1.5,
                  borderRadius: 2,
                  color: item.selected ? "primary.main" : "text.secondary",
                  bgcolor: item.selected ? "primary.50" : "transparent",
                  "&:hover": {
                    bgcolor: item.selected ? "primary.50" : "action.hover",
                  },
                }}
              >
                {item.icon}
                <Typography variant="body2" sx={{ fontWeight: item.selected ? 700 : 500 }}>
                  {item.label}
                </Typography>
              </ButtonBase>
            ))}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 2 }, flexShrink: 0 }}>
            <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", gap: 1, minWidth: 0 }}>
              <Avatar
                src={AvatarIcon}
                alt=""
                sx={{ width: 36, height: 36, bgcolor: "grey.100" }}
              />
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", lineHeight: 1.2 }}>
                  Signed in as
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 700, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                >
                  {authData?.username || "User"}
                </Typography>
              </Box>
            </Box>
            <ButtonBase
              onClick={() => setSignOutOpen(true)}
              sx={{
                minHeight: 40,
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 1.25,
                borderRadius: 2,
                color: "text.secondary",
                "&:hover": { bgcolor: "action.hover", color: "error.main" },
              }}
            >
              <LogOut size={18} />
              <Typography variant="body2" sx={{ fontWeight: 500, display: { xs: "none", sm: "block" } }}>
                Sign out
              </Typography>
            </ButtonBase>
          </Box>
        </Box>

        <Box
          component="main"
          sx={{
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            width: "100%",
            overflowY: "auto",
            overscrollBehavior: "contain",
            p: { xs: 1.5, sm: 2.5, md: 3 },
            boxSizing: "border-box",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </>
  );
}
