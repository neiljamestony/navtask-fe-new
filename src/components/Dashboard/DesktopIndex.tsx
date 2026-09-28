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
          width: "100%",
          height: "100vh",
          overflow: "hidden",
          bgcolor: "#f6f8fb",
        }}
      >
        <Box
          component="aside"
          sx={{
            width: 248,
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            px: 2,
            py: 2.5,
            bgcolor: "#fff",
            borderRight: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              px: 1.25,
              mb: 4,
            }}
          >
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

          <Typography
            variant="overline"
            sx={{ px: 1.5, mb: 1, color: "text.secondary", fontWeight: 700 }}
          >
            Workspace
          </Typography>

          <Box component="nav" aria-label="Main navigation">
            {navItems.map((item) => (
              <ButtonBase
                key={item.label}
                onClick={item.onClick}
                aria-current={item.selected ? "page" : undefined}
                sx={{
                  width: "100%",
                  minHeight: 44,
                  justifyContent: "flex-start",
                  gap: 1.5,
                  px: 1.5,
                  mb: 0.75,
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

          <Box sx={{ mt: "auto" }}>
            <ButtonBase
              onClick={() => setSignOutOpen(true)}
              sx={{
                width: "100%",
                minHeight: 44,
                justifyContent: "flex-start",
                gap: 1.5,
                px: 1.5,
                mb: 1.5,
                borderRadius: 2,
                color: "text.secondary",
                "&:hover": { bgcolor: "action.hover", color: "error.main" },
              }}
            >
              <LogOut size={19} />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Sign out
              </Typography>
            </ButtonBase>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.25,
                p: 1.25,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2.5,
                minWidth: 0,
              }}
            >
              <Avatar
                src={AvatarIcon}
                alt=""
                sx={{ width: 36, height: 36, bgcolor: "grey.100" }}
              />
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="caption" color="text.secondary">
                  Signed in as
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                >
                  {authData?.username || "User"}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box
          component="main"
          sx={{
            flex: 1,
            minWidth: 0,
            height: "100%",
            overflowY: "auto",
            overscrollBehavior: "contain",
            p: { xs: 1.5, md: 3 },
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </>
  );
}