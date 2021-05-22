import parseCookies from "@/utils/parseCookies";
import { API_URL } from "@/config/index";
import styles from "@/styles/Dashboard.module.css";
import DashboardEvent from "@/components/DashboardEvent";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useRouter } from "next/router";

export default function DashboardPage({ events, token }) {
  const router = useRouter();
  async function deleteEvent(id) {
    if (confirm("Are you sure?")) {
      try {
        const res = await axios.delete(`${API_URL}/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        router.reload();
      } catch (e) {
        if (e.response) {
          console.log(e.response.data);
          console.log(e.response.status);
          console.log(e.response.headers);
        }
        toast.error("Something Went Wrong");
      }
    }
  }
  return (
    <div className={styles.dash}>
      <h1>Dashboard</h1>
      <h3>My Events</h3>
      {events.map((evt) => (
        <DashboardEvent key={evt.id} evt={evt} handleDelete={deleteEvent} />
      ))}
    </div>
  );
}

export async function getServerSideProps({ req }) {
  const { token } = parseCookies(req);
  try {
    const res = await axios(`${API_URL}/events/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return {
      props: { events: res.data, token },
    };
  } catch (e) {
    return {
      redirect: {
        destination: "/account/login",
        permanent: false,
      },
    };
  }
}
