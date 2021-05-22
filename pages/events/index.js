import axios from "axios";
import { API_URL, PER_PAGE } from "@/config/index";
import EventItem from "@/components/EventItem";
import Pagination from "@/components/Pagination";

export default function EventsPage({ events, page, total }) {
  const lastPage = Math.ceil(total / PER_PAGE);
  return (
    <div>
      <h1>Events</h1>
      {events.length === 0 && <h3>No events to show</h3>}
      {events.map((evt) => {
        return <EventItem key={evt.id} evt={evt} />;
      })}
      <Pagination page={page} total={total} />
    </div>
  );
}

export async function getServerSideProps({ query: { page = 1 } }) {
  // calculate start page
  const start = +page === 1 ? 0 : (+page - 1) * PER_PAGE;

  const [EventRes, CountRes] = await Promise.all([
    axios.get(
      `${API_URL}/events?_sort=date:ASC&_limit=${PER_PAGE}&_start=${start}`
    ),
    axios.get(`${API_URL}/events/count`),
  ]);

  return {
    props: {
      events: EventRes.data,
      page: +page,
      total: CountRes.data,
    },
  };
}
