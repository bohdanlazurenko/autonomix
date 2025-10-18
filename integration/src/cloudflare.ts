import axios from "axios";

export interface CloudflareRecord {
  type: "CNAME" | "TXT" | "A";
  name: string;
  content: string;
  ttl?: number;
  proxied?: boolean;
}

/**
 * Create DNS record in Cloudflare
 */
export async function createDnsRecord({
  token,
  zoneId,
  record,
}: {
  token: string;
  zoneId: string;
  record: CloudflareRecord;
}): Promise<void> {
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  await axios.post(
    `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`,
    {
      type: record.type,
      name: record.name,
      content: record.content,
      ttl: record.ttl || 120,
      proxied: record.proxied ?? false,
    },
    { headers }
  );

  console.log(`✓ DNS record created: ${record.type} ${record.name} -> ${record.content}`);
}

/**
 * Setup subdomain for tenant
 */
export async function setupTenantSubdomain({
  token,
  zoneId,
  tenant,
  target,
  baseDomain,
}: {
  token: string;
  zoneId: string;
  tenant: string;
  target: string;
  baseDomain: string;
}): Promise<string> {
  const subdomain = `${tenant}.${baseDomain}`;

  await createDnsRecord({
    token,
    zoneId,
    record: {
      type: "CNAME",
      name: subdomain,
      content: target,
      ttl: 120,
      proxied: false,
    },
  });

  return subdomain;
}

/**
 * Create verification TXT record for custom domain
 */
export async function createVerificationRecord({
  token,
  zoneId,
  domain,
  verificationToken,
}: {
  token: string;
  zoneId: string;
  domain: string;
  verificationToken: string;
}): Promise<void> {
  await createDnsRecord({
    token,
    zoneId,
    record: {
      type: "TXT",
      name: `_verify.${domain}`,
      content: verificationToken,
      ttl: 120,
    },
  });

  console.log(`✓ Verification record created for ${domain}`);
}

/**
 * Check if DNS record exists
 */
export async function checkDnsRecord({
  token,
  zoneId,
  name,
  type,
}: {
  token: string;
  zoneId: string;
  name: string;
  type: string;
}): Promise<boolean> {
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const { data } = await axios.get(
    `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records?name=${name}&type=${type}`,
    { headers }
  );

  return data.result && data.result.length > 0;
}
