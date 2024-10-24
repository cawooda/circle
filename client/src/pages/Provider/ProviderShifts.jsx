import ShiftRow from "../../components/ShiftRow";
import { useUser } from "../../contexts/UserContext";
import NotifyUser from "../../components/NotifyUser";

export default function ProviderShifts() {
  const {
    provider,
    loading: providerLoading,
    error: providerError,
  } = useUser();

  if (providerLoading) {
    return <div>Loading...</div>;
  }

  if (providerError) {
    return <div>Error loading shifts</div>;
  }
  if (!provider) {
    return <div>No provider attached to your account available</div>;
  }

  if (provider) {
    return (
      <div>
        {provider.shifts?.length ? (
          provider.shifts.map((shift, index) => (
            <>
              <ShiftRow index={index} key={shift._id} shift={shift} />
            </>
          ))
        ) : (
          <NotifyUser component="providerShifts" message="No Shifts" />
        )}
      </div>
    );
  }
}
