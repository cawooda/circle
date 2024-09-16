import { useEffect } from "react";
import { Heading } from "@chakra-ui/react";
import ServiceAgreementRow from "../../components/ServiceAgreementRow";
import { QUERY_SERVICE_AGREEMENTS } from "../../utils/queries";
import { useUser } from "../../contexts/UserContext";
import NotifyUser from "../../components/NotifyUser";

export default function ProviderServiceAgreements() {
  const { user, loading, error } = useUser();
  console.log(user);
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading service agreements</div>;
  }
  if (!user) {
    return <div>No user available</div>; // Gracefully handle the case when user is not available
  }

  if (user) {
    return (
      <div>
        {user?.serviceAgreements?.length ? (
          user.serviceAgreements.map((agreement, index) => (
            <>
              <ServiceAgreementRow
                index={index}
                key={agreement._id}
                agreement={agreement}
                user={user}
              />
            </>
          ))
        ) : (
          <NotifyUser
            component="providerServiceAgreements"
            message="No Service Agreements"
          />
        )}
      </div>
    );
  }
}
