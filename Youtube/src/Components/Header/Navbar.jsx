import React, { useState, useEffect, useRef } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Button,
  Paper,
  Divider,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";

import MenuIcon from "@mui/icons-material/Menu";
import YouTubeIcon from "@mui/icons-material/YouTube";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import AddIcon from "@mui/icons-material/Add";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { toast } from "react-toastify";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Login from "../Pages/Home/Login";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: 50,
  backgroundColor: "#121212",
  border: "1px solid #555",
  marginRight: theme.spacing(2),
  marginLeft: 0,
  display: "flex",
  flexGrow: 1,
}));


const SearchInput = styled(InputBase)(({ theme }) => ({
  color: "#fff",
  paddingLeft: theme.spacing(2),
  flex: 1,
}));

function Navbar({ setSideNavBarFunc, sideNavBar }) {
  const [userPic, setUserPic] = useState(
    "https://tse1.mm.bing.net/th?id=OIP._jWJU88HhaBBRUhhr6FhjQAAAA&pid=Api&P=0&h=180"
  );
  const [login, setLogin] = useState(false);
  const [userLogIn, setUserLogin] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const modalRef = useRef();

  const handleNavToggle = () => setSideNavBarFunc(!sideNavBar);
  const handleAvatarClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleModal = () => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      navigate(`/user/${userId}`);
    }
    handleClose();
  };

  const handleLogin = () => {
    setLogin(true);
    handleClose();
  };

  const handleSignUp=()=>{
    navigate("/signUp");
  }

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    try {
      const res = await axios.get(
        `http://localhost:5000/api/v1/video/search?q=${encodeURIComponent(
          query
        )}`
      );
      // Assuming you have a route to display search results
      navigate(`/search?q=${encodeURIComponent(query)}`, {
        state: { results: res.data.data },
      });
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  const handleCancel = () => setLogin(false);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/users/logout`,
        {},
        { withCredentials: true }
      );
      toast.success("Successfully logged out.");
      localStorage.clear();
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.error("Error during logout:", err);
      alert("An error occurred while logging out. Please try again.");
    }
    handleClose();
  };

  useEffect(() => {
    setAnchorEl(null);
  }, [location]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
    try{
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/current-user`,
        {
          headers: {
            Authorization: `Bearer ${localStorage
              .getItem("accesstoken")
              .trim()}`,
          },
        }
      );
      setUserPic(res.data.data.avatar)
      setUserLogin(true)
    }
    catch(err){
      console.log("failed to fetch user",err)
    }
  }
  fetchCurrentUser()},[])

  return (
    <>
      <AppBar
        position="fixed"
        sx={{ backgroundColor: "#0f0f0f", boxShadow: "none", zIndex: 1300 }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            flexWrap: "wrap", // Enable wrapping on small screens
            width: "100%", // Make sure it spans full width
            px: { xs: 1, sm: 2 },
          }}
        >
          {/* Left Section */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton onClick={handleNavToggle} sx={{ color: "white" }}>
              <MenuIcon />
            </IconButton>
            <Link
              to="/"
              className="flex items-center space-x-2 text-decoration-none"
            >
              <span className="text-2xl font-extrabold text-[#FF4C4C] tracking-wide">
                Vidzora
              </span>
            </Link>
          </Box>

          {/* Center Search Section */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flex: 1,
              mx: { xs: 1, sm: 2, md: 6, lg: 10 }, // reduce margin on small screens
              minWidth: 0, // Prevents overflow
            }}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault(); // Prevent full page reload
                handleSearch();
              }}
              style={{ flexGrow: 1, width: "100%", display: "flex" }}
            >
              <Search sx={{ flexGrow: 1, width: "100%" }}>
                <SearchInput
                  placeholder="Search…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <IconButton type="submit" sx={{ p: 1, color: "white" }}>
                  <SearchIcon />
                </IconButton>
              </Search>
            </form>

            <IconButton
              sx={{
                ml: 1,
                color: "white",
                display: { xs: "none", sm: "block" },
              }} // hide mic on XS
            >
              <KeyboardVoiceIcon />
            </IconButton>
          </Box>

          {/* Right Section */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mt: { xs: 1, sm: 0 }, // push down on mobile
              flexWrap: "wrap",
            }}
          >
            <Link
              to="/upload"
              style={{
                color: "white",
                textDecoration: "none",
                backgroundColor: "#2a2a2a",
                padding: "6px 12px",
                borderRadius: 50,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <AddIcon sx={{ fontSize: { sm: "26px", xs: "20px" } }} />
              <Typography
                variant="body1"
                sx={{ display: { xs: "none", sm: "block" } }}
              >
                Create
              </Typography>
            </Link>

            <IconButton sx={{ color: "white" }}>
              <NotificationsIcon sx={{ fontSize: 28 }} />
            </IconButton>

            <IconButton onClick={handleAvatarClick}>
              <Avatar src={userPic} alt="user" />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Avatar Dropdown */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: { backgroundColor: "#2d2d2d", color: "#fff", mt: 1 },
        }}
      >
        {userLogIn && (
          <MenuItem
            onClick={handleModal}
            sx={{ ":hover": { backgroundColor: "#3a3a3a" } }}
          >
            Profile
          </MenuItem>
        )}
        {!userLogIn ? (
          <div>
            <MenuItem
              onClick={handleLogin}
              sx={{ ":hover": { backgroundColor: "#3a3a3a" } }}
            >
              Login
            </MenuItem>
            <MenuItem
              onClick={handleSignUp}
              sx={{ ":hover": { backgroundColor: "#3a3a3a" } }}
            >
              SignUp
            </MenuItem>
          </div>
        ) : (
          <MenuItem
            onClick={handleLogout}
            sx={{ ":hover": { backgroundColor: "#3a3a3a" } }}
          >
            Logout
          </MenuItem>
        )}
      </Menu>

      {login && <Login handleCancel={handleCancel} />}
    </>
  );
}

export default Navbar;
