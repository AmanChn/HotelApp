// src/components/datatable/Datatable.jsx
import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import useFetch from "../../hooks/useFetch";
import axios from "axios";

const Datatable = ({ columns }) => {
  const location = useLocation();
  const path = location.pathname.split("/")[1];
  const [list, setList] = useState([]);
  const { data, loading, error, reFetch } = useFetch(`/${path}`);
  const navigate = useNavigate();

  const handleFetch = useCallback(() => {
    console.log("Triggering re-fetch for path:", path);
    reFetch();
  }, [path, reFetch]);

  // Re-fetch on path or refresh state change
  useEffect(() => {
    if (location.state?.refresh) {
      console.log("Refresh triggered by navigation state");
      handleFetch();
    } else {
      handleFetch();
    }
  }, [location.pathname, location.state, handleFetch]);

  // Update list when data changes
  useEffect(() => {
    console.log("State:", { data, loading, error, list });
    if (data && data.length > 0) {
      setList(data);
      console.log("Set list:", data);
    }
    if (error && error.response?.status === 401) {
      console.log("Unauthorized, redirecting to login");
      navigate("/login");
    }
  }, [data, error, navigate]); // Removed list, loading from dependencies

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/${path}/${id}`, { withCredentials: true });
      setList(list.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link
              to={`/${path}/${params.row._id}`}
              style={{ textDecoration: "none" }}
            >
              <div className="viewButton">View</div>
            </Link>
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row._id)}
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="datatable">
      <div className="datatableTitle">
        {path.charAt(0).toUpperCase() + path.slice(1)}
        <Link to={`/${path}/new`} className="link">
          Add New
        </Link>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message || "Failed to load data"}</p>
      ) : list.length === 0 ? (
        <p>No data available</p>
      ) : (
        <DataGrid
          className="datagrid"
          rows={list}
          columns={columns.concat(actionColumn)}
          pageSize={9}
          rowsPerPageOptions={[9]}
          checkboxSelection
          getRowId={(row) => row._id}
        />
      )}
    </div>
  );
};

export default Datatable;