import Link from "next/link";

export default function legal() {
  return (
    <div className="flex-center flex-column">
      <h1>Legal notice</h1>
      <div className="container-text">
        <h3>Information according to § 5TMG</h3>
        <p>
          <b>Janis Meister</b>
          <br /> Explainegy
          <br /> Borsigstrasse 8<br /> 27574 Bremerhaven
          <br /> Germany
          <br />
        </p>
        <h3>Contact</h3>
        <p>
          E-mail: <Link href="mailto:contact@explainegy.com">contact@explainegy.com</Link>
          <br />
        </p>
        <h3>EU Dispute Resolution</h3>
        <p>
          The European Commission provides a platform for online dispute resolution:
          <br /> <Link href="https://ec.europa.eu/consumers/odr/"> https://ec.europa.eu/consumers/odr/ </Link>.<br /> You can find our e-mail address in the legal notice above.
          <br />
        </p>
        <h3>Consumer dispute resolution/universal arbitration board</h3>
        <p>
          We are not willing or obliged to participate in dispute resolution proceedings
          <br /> before a consumer arbitration board.
        </p>
        <h3>Liability for contents</h3>
        <p>
          As a service provider, we are responsible for our own content on these pages under pages according to the general laws. According to §§ 8 to 10 TMG as a service provider,
          we are not obligated to monitor transmitted or stored to monitor transmitted or stored third-party information or to investigate circumstances or to investigate
          circumstances that indicate illegal activity.
          <br /> <br /> Obligations to remove or block the use of information according to the general laws remain unaffected. A liability in this respect liability is only
          possible from the time of knowledge of a concrete infringement. infringement is possible. If we become aware of any such infringements, we will infringements, we will
          remove this content immediately.
        </p>
        <h3>Liability for links</h3>
        <p>
          Our offer contains links to external websites of third parties, the contents of which are we have no influence. Therefore, we can for these foreign contents also take
          over no guarantee. For the contents of the linked pages is always the provider or operator of the pages is responsible for the content of the linked pages. The linked
          pages were checked for possible legal violations at the time of linking. checked. Illegal contents were not recognizable at the time of linking. recognizable at the time
          of linking.
          <br />
          <br /> However, a permanent control of the contents of the linked pages is not reasonable without concrete evidence of a violation of the law is not reasonable. In the
          case of infringements become known, we will remove such links immediately. remove them.
        </p>
        <h3>Copyright</h3>
        <p>
          The contents and works created by the site operators on these pages are subject to German copyright law. The duplication, processing, distribution and any kind of
          exploitation outside the limits of the copyright copyright require the written consent of the author or creator. or creator. Downloads and copies of this site are only
          for private, non-commercial use.
          <br /> <br /> As far as the contents on this page were not created by the operator, the copyrights of third parties are respected. In particular, the content of third
          parties marked as such. Should you nevertheless become aware of a copyright infringement, we ask for an appropriate reference. notice. If we become aware of any
          infringements, we will remove the respective content remove immediately.
        </p>
      </div>
    </div>
  );
}
