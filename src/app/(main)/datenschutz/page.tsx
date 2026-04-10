import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutzerklärung – mycleandent",
};

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ color: "#00385E", fontSize: 20, fontWeight: 700, marginTop: 48, marginBottom: 16 }}>
      {children}
    </h2>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 style={{ color: "#00385E", fontSize: 16, fontWeight: 700, marginTop: 28, marginBottom: 10 }}>
      {children}
    </h3>
  );
}

function P({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <p style={{ color: "#00385E", fontSize: 14, lineHeight: 1.85, marginBottom: 14, marginTop: 0, ...style }}>
      {children}
    </p>
  );
}

function A({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: "#F5907B", wordBreak: "break-all" }}>
      {children}
    </a>
  );
}

function Ul({ children }: { children: React.ReactNode }) {
  return (
    <ul style={{ color: "#00385E", fontSize: 14, lineHeight: 1.85, paddingLeft: 24, marginBottom: 14 }}>
      {children}
    </ul>
  );
}

export default function DatenschutzPage() {
  return (
    <section style={{ background: "#FEF9F5", padding: "80px 0 100px" }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px" }}>

        <h1 style={{ color: "#00385E", fontSize: 32, fontWeight: 700, marginBottom: 8, marginTop: 0 }}>
          Datenschutzerklärung
        </h1>

        {/* 1 */}
        <H2>1. Datenschutz auf einen Blick</H2>

        <H3>Allgemeine Hinweise</H3>
        <P>Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können. Ausführliche Informationen zum Thema Datenschutz entnehmen Sie unserer unter diesem Text aufgeführten Datenschutzerklärung.</P>

        <H3>Datenerfassung auf dieser Website</H3>
        <H3>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</H3>
        <P>Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Abschnitt „Hinweis zur Verantwortlichen Stelle" in dieser Datenschutzerklärung entnehmen.</P>

        <H3>Wie erfassen wir Ihre Daten?</H3>
        <P>Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z. B. um Daten handeln, die Sie in ein Kontaktformular eingeben.</P>
        <P>Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch der Website durch unsere IT-Systeme erfasst. Das sind vor allem technische Daten (z. B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs). Die Erfassung dieser Daten erfolgt automatisch, sobald Sie diese Website betreten.</P>

        <H3>Wofür nutzen wir Ihre Daten?</H3>
        <P>Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu gewährleisten. Andere Daten können zur Analyse Ihres Nutzerverhaltens verwendet werden. Sofern über die Website Verträge geschlossen oder angebahnt werden können, werden die übermittelten Daten auch für Vertragsangebote, Bestellungen oder sonstige Auftragsanfragen verarbeitet.</P>

        <H3>Welche Rechte haben Sie bezüglich Ihrer Daten?</H3>
        <P>Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung oder Löschung dieser Daten zu verlangen. Wenn Sie eine Einwilligung zur Datenverarbeitung erteilt haben, können Sie diese Einwilligung jederzeit für die Zukunft widerrufen. Außerdem haben Sie das Recht, unter bestimmten Umständen die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen. Des Weiteren steht Ihnen ein Beschwerderecht bei der zuständigen Aufsichtsbehörde zu.</P>
        <P>Hierzu sowie zu weiteren Fragen zum Thema Datenschutz können Sie sich jederzeit an uns wenden.</P>

        <H3>Analyse-Tools und Tools von Drittanbietern</H3>
        <P>Beim Besuch dieser Website kann Ihr Surf-Verhalten statistisch ausgewertet werden. Das geschieht vor allem mit sogenannten Analyseprogrammen. Detaillierte Informationen zu diesen Analyseprogrammen finden Sie in der folgenden Datenschutzerklärung.</P>

        {/* 2 */}
        <H2>2. Hosting</H2>
        <P>Wir hosten die Inhalte unserer Website bei folgendem Anbieter:</P>

        <H3>Mittwald</H3>
        <P>Anbieter ist die Mittwald CM Service GmbH &amp; Co. KG, Königsberger Straße 4-6, 32339 Espelkamp (nachfolgend Mittwald). Details entnehmen Sie der Datenschutzerklärung von Mittwald: <A href="https://www.mittwald.de/datenschutz">https://www.mittwald.de/datenschutz</A>.</P>
        <P>Die Verwendung von Mittwald erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Wir haben ein berechtigtes Interesse an einer möglichst zuverlässigen Darstellung unserer Website. Sofern eine entsprechende Einwilligung abgefragt wurde, erfolgt die Verarbeitung ausschließlich auf Grundlage von Art. 6 Abs. 1 lit. a DSGVO und § 25 Abs. 1 TDDDG. Die Einwilligung ist jederzeit widerrufbar.</P>

        <H3>Auftragsverarbeitung</H3>
        <P>Wir haben einen Vertrag über Auftragsverarbeitung (AVV) zur Nutzung des oben genannten Dienstes geschlossen. Hierbei handelt es sich um einen datenschutzrechtlich vorgeschriebenen Vertrag, der gewährleistet, dass dieser die personenbezogenen Daten unserer Websitebesucher nur nach unseren Weisungen und unter Einhaltung der DSGVO verarbeitet.</P>

        {/* 3 */}
        <H2>3. Allgemeine Hinweise und Pflichtinformationen</H2>

        <H3>Datenschutz</H3>
        <P>Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend den gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.</P>
        <P>Wir weisen darauf hin, dass die Datenübertragung im Internet (z. B. bei der Kommunikation per E-Mail) Sicherheitslücken aufweisen kann. Ein lückenloser Schutz der Daten vor dem Zugriff durch Dritte ist nicht möglich.</P>

        <H3>Hinweis zur verantwortlichen Stelle</H3>
        <P>Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:</P>
        <P>
          CleanImplant Foundation CIF GmbH<br />
          Pariser Platz 4a, 10117 Berlin<br />
          Geschäftsführer: Dr. Dirk Duddeck<br />
          Telefon: +49 (0) 30 2218 7223<br />
          E-Mail: <A href="mailto:info@cleanimplant.org">info@cleanimplant.org</A>
        </P>

        <H3>Speicherdauer</H3>
        <P>Soweit innerhalb dieser Datenschutzerklärung keine speziellere Speicherdauer genannt wurde, verbleiben Ihre personenbezogenen Daten bei uns, bis der Zweck für die Datenverarbeitung entfällt. Wenn Sie ein berechtigtes Löschersuchen geltend machen oder eine Einwilligung zur Datenverarbeitung widerrufen, werden Ihre Daten gelöscht, sofern wir keine anderen rechtlich zulässigen Gründe für die Speicherung Ihrer personenbezogenen Daten haben.</P>

        <H3>Allgemeine Hinweise zu den Rechtsgrundlagen der Datenverarbeitung auf dieser Website</H3>
        <P>Sofern Sie in die Datenverarbeitung eingewilligt haben, verarbeiten wir Ihre personenbezogenen Daten auf Grundlage von Art. 6 Abs. 1 lit. a DSGVO bzw. Art. 9 Abs. 2 lit. a DSGVO. Sind Ihre Daten zur Vertragserfüllung oder zur Durchführung vorvertraglicher Maßnahmen erforderlich, verarbeiten wir Ihre Daten auf Grundlage des Art. 6 Abs. 1 lit. b DSGVO. Des Weiteren verarbeiten wir Ihre Daten, sofern diese zur Erfüllung einer rechtlichen Verpflichtung erforderlich sind auf Grundlage von Art. 6 Abs. 1 lit. c DSGVO. Die Datenverarbeitung kann ferner auf Grundlage unseres berechtigten Interesses nach Art. 6 Abs. 1 lit. f DSGVO erfolgen.</P>

        <H3>Empfänger von personenbezogenen Daten</H3>
        <P>Im Rahmen unserer Geschäftstätigkeit arbeiten wir mit verschiedenen externen Stellen zusammen. Dabei ist teilweise auch eine Übermittlung von personenbezogenen Daten an diese externen Stellen erforderlich. Wir geben personenbezogene Daten nur dann an externe Stellen weiter, wenn dies im Rahmen einer Vertragserfüllung erforderlich ist, wenn wir gesetzlich hierzu verpflichtet sind, wenn wir ein berechtigtes Interesse nach Art. 6 Abs. 1 lit. f DSGVO an der Weitergabe haben oder wenn eine sonstige Rechtsgrundlage die Datenweitergabe erlaubt.</P>

        <H3>Widerruf Ihrer Einwilligung zur Datenverarbeitung</H3>
        <P>Viele Datenverarbeitungsvorgänge sind nur mit Ihrer ausdrücklichen Einwilligung möglich. Sie können eine bereits erteilte Einwilligung jederzeit widerrufen. Die Rechtmäßigkeit der bis zum Widerruf erfolgten Datenverarbeitung bleibt vom Widerruf unberührt.</P>

        <H3>Widerspruchsrecht gegen die Datenerhebung in besonderen Fällen sowie gegen Direktwerbung (Art. 21 DSGVO)</H3>
        <P style={{ textTransform: "uppercase", fontSize: 13 }}>
          Wenn die Datenverarbeitung auf Grundlage von Art. 6 Abs. 1 lit. e oder f DSGVO erfolgt, haben Sie jederzeit das Recht, aus Gründen, die sich aus Ihrer besonderen Situation ergeben, gegen die Verarbeitung Ihrer personenbezogenen Daten Widerspruch einzulegen; dies gilt auch für ein auf diese Bestimmungen gestütztes Profiling. Werden Ihre personenbezogenen Daten verarbeitet, um Direktwerbung zu betreiben, so haben Sie das Recht, jederzeit Widerspruch gegen die Verarbeitung Sie betreffender personenbezogener Daten zum Zwecke derartiger Werbung einzulegen.
        </P>

        <H3>Beschwerderecht bei der zuständigen Aufsichtsbehörde</H3>
        <P>Im Falle von Verstößen gegen die DSGVO steht den Betroffenen ein Beschwerderecht bei einer Aufsichtsbehörde, insbesondere in dem Mitgliedstaat ihres gewöhnlichen Aufenthalts, ihres Arbeitsplatzes oder des Orts des mutmaßlichen Verstoßes zu.</P>

        <H3>Recht auf Datenübertragbarkeit</H3>
        <P>Sie haben das Recht, Daten, die wir auf Grundlage Ihrer Einwilligung oder in Erfüllung eines Vertrags automatisiert verarbeiten, an sich oder an einen Dritten in einem gängigen, maschinenlesbaren Format aushändigen zu lassen.</P>

        <H3>Auskunft, Berichtigung und Löschung</H3>
        <P>Sie haben im Rahmen der geltenden gesetzlichen Bestimmungen jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger und den Zweck der Datenverarbeitung und ggf. ein Recht auf Berichtigung oder Löschung dieser Daten.</P>

        <H3>Recht auf Einschränkung der Verarbeitung</H3>
        <P>Sie haben das Recht, die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen. Das Recht auf Einschränkung der Verarbeitung besteht in folgenden Fällen:</P>
        <Ul>
          <li>Wenn Sie die Richtigkeit Ihrer bei uns gespeicherten personenbezogenen Daten bestreiten.</li>
          <li>Wenn die Verarbeitung Ihrer personenbezogenen Daten unrechtmäßig geschah/geschieht.</li>
          <li>Wenn wir Ihre personenbezogenen Daten nicht mehr benötigen, Sie sie jedoch zur Ausübung, Verteidigung oder Geltendmachung von Rechtsansprüchen benötigen.</li>
          <li>Wenn Sie einen Widerspruch nach Art. 21 Abs. 1 DSGVO eingelegt haben.</li>
        </Ul>

        <H3>SSL- bzw. TLS-Verschlüsselung</H3>
        <P>Diese Seite nutzt aus Sicherheitsgründen eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von „http://" auf „https://" wechselt.</P>

        <H3>Widerspruch gegen Werbe-E-Mails</H3>
        <P>Der Nutzung von im Rahmen der Impressumspflicht veröffentlichten Kontaktdaten zur Übersendung von nicht ausdrücklich angeforderter Werbung wird hiermit widersprochen.</P>

        {/* 4 */}
        <H2>4. Datenerfassung auf dieser Website</H2>

        <H3>Cookies</H3>
        <P>Unsere Internetseiten verwenden so genannte „Cookies". Cookies sind kleine Datenpakete und richten auf Ihrem Endgerät keinen Schaden an. Sie werden entweder vorübergehend für die Dauer einer Sitzung (Session-Cookies) oder dauerhaft (permanente Cookies) auf Ihrem Endgerät gespeichert.</P>
        <P>Sie können Ihren Browser so einstellen, dass Sie über das Setzen von Cookies informiert werden und Cookies nur im Einzelfall erlauben, die Annahme von Cookies für bestimmte Fälle oder generell ausschließen sowie das automatische Löschen der Cookies beim Schließen des Browsers aktivieren.</P>

        <H3>Einwilligung mit Borlabs Cookie</H3>
        <P>Unsere Website nutzt die Consent-Technologie von Borlabs Cookie, um Ihre Einwilligung zur Speicherung bestimmter Cookies einzuholen. Anbieter ist die Borlabs GmbH, Rübenkamp 32, 22305 Hamburg. Details zur Datenverarbeitung finden Sie unter <A href="https://de.borlabs.io/kb/welche-daten-speichert-borlabs-cookie/">https://de.borlabs.io/kb/welche-daten-speichert-borlabs-cookie/</A>.</P>

        <H3>Server-Log-Dateien</H3>
        <P>Der Provider der Seiten erhebt und speichert automatisch Informationen in Server-Log-Dateien. Dies sind: Browsertyp und -version, verwendetes Betriebssystem, Referrer URL, Hostname des zugreifenden Rechners, Uhrzeit der Serveranfrage, IP-Adresse. Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen.</P>

        <H3>Kontaktformular</H3>
        <P>Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter. Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO.</P>

        <H3>Anfrage per E-Mail, Telefon oder Telefax</H3>
        <P>Wenn Sie uns per E-Mail, Telefon oder Telefax kontaktieren, wird Ihre Anfrage inklusive aller daraus hervorgehenden personenbezogenen Daten zum Zwecke der Bearbeitung Ihres Anliegens bei uns gespeichert und verarbeitet. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.</P>

        <H3>jameda</H3>
        <P>Wir haben jameda auf dieser Website eingebunden. Anbieter ist jameda GmbH, Balanstr. 71a, 81541 München. Die Verwendung von jameda erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO.</P>

        <H3>Doctolib</H3>
        <P>Auf unserer Website haben Sie die Möglichkeit, Termine mit uns zu vereinbaren. Für die Terminbuchung nutzen wir Doctolib. Anbieter ist die Doctolib GmbH, Mehringdamm 51, 10961 Berlin. Die Datenschutzerklärung von Doctolib finden Sie unter <A href="https://media.doctolib.com/image/upload/v1682432985/legal/B2C-PrivacyPolicy-Apr-23-DE.pdf">diesem Link</A>.</P>

        <H3>Registrierung auf dieser Website</H3>
        <P>Sie können sich auf dieser Website registrieren, um zusätzliche Funktionen zu nutzen. Die dazu eingegebenen Daten verwenden wir nur zum Zwecke der Nutzung des jeweiligen Angebotes oder Dienstes, für den Sie sich registriert haben.</P>

        {/* 5 */}
        <H2>5. Soziale Medien</H2>

        <H3>Facebook</H3>
        <P>Auf dieser Website sind Elemente des sozialen Netzwerks Facebook integriert. Anbieter ist die Meta Platforms Ireland Limited, Merrion Road, Dublin 4, D04 X2K5, Irland. Weitere Informationen finden Sie in der <A href="https://de-de.facebook.com/privacy/explanation">Datenschutzerklärung von Facebook</A>. Die Nutzung erfolgt auf Grundlage Ihrer Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO.</P>

        <H3>Instagram</H3>
        <P>Auf dieser Website sind Funktionen des Dienstes Instagram eingebunden, angeboten durch die Meta Platforms Ireland Limited. Weitere Informationen finden Sie in der <A href="https://privacycenter.instagram.com/policy/">Datenschutzerklärung von Instagram</A>. Die Nutzung erfolgt auf Grundlage Ihrer Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO.</P>

        <H3>LinkedIn</H3>
        <P>Diese Website nutzt Elemente des Netzwerks LinkedIn. Anbieter ist die LinkedIn Ireland Unlimited Company, Wilton Plaza, Wilton Place, Dublin 2, Irland. Weitere Informationen finden Sie in der <A href="https://www.linkedin.com/legal/privacy-policy">Datenschutzerklärung von LinkedIn</A>. Die Nutzung erfolgt auf Grundlage Ihrer Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO.</P>

        {/* 6 */}
        <H2>6. Analyse-Tools und Werbung</H2>

        <H3>Google Tag Manager</H3>
        <P>Wir setzen den Google Tag Manager ein. Anbieter ist die Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland. Der Google Tag Manager ist ein Tool zur Verwaltung und Ausspielung von Tracking- und Statistik-Tools. Er erfasst Ihre IP-Adresse, die auch an das Mutterunternehmen von Google in den USA übertragen werden kann.</P>

        <H3>Google Analytics</H3>
        <P>Diese Website nutzt Funktionen des Webanalysedienstes Google Analytics (Google Ireland Limited). Google Analytics ermöglicht es dem Websitebetreiber, das Verhalten der Websitebesucher zu analysieren. Die Nutzung erfolgt auf Grundlage Ihrer Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO. Weitere Informationen: <A href="https://support.google.com/analytics/answer/6004245?hl=de">Datenschutzerklärung Google Analytics</A>.</P>
        <P>Die Google Analytics IP-Anonymisierung ist aktiviert. Dadurch wird Ihre IP-Adresse von Google innerhalb von Mitgliedstaaten der EU vor der Übermittlung in die USA gekürzt.</P>
        <P>Sie können die Erfassung Ihrer Daten durch Google verhindern, indem Sie das <A href="https://tools.google.com/dlpage/gaoptout?hl=de">Browser-Plugin herunterladen und installieren</A>.</P>

        <H3>Google Ads</H3>
        <P>Der Websitebetreiber verwendet Google Ads (Google Ireland Limited). Google Ads ermöglicht es uns, Werbeanzeigen in der Google-Suchmaschine oder auf Drittwebseiten auszuspielen. Die Nutzung erfolgt auf Grundlage Ihrer Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO.</P>

        <H3>Google Ads Remarketing</H3>
        <P>Diese Website nutzt die Funktionen von Google Ads Remarketing. Mit Google Ads Remarketing können wir Personen, die mit unserem Online-Angebot interagieren, bestimmten Zielgruppen zuordnen. Wenn Sie über einen Google-Account verfügen, können Sie der personalisierten Werbung unter <A href="https://adssettings.google.com/anonymous?hl=de">diesem Link</A> widersprechen.</P>

        <H3>Google Conversion-Tracking</H3>
        <P>Diese Website nutzt Google Conversion Tracking. Mit Hilfe von Google-Conversion-Tracking können Google und wir erkennen, ob der Nutzer bestimmte Aktionen durchgeführt hat. Weitere Informationen: <A href="https://policies.google.com/privacy?hl=de">Datenschutzbestimmungen Google</A>.</P>

        <H3>Meta-Pixel (ehemals Facebook Pixel)</H3>
        <P>Diese Website nutzt zur Konversionsmessung den Besucheraktions-Pixel von Meta (Meta Platforms Ireland Limited, 4 Grand Canal Square, Dublin 2, Irland). Die Nutzung erfolgt auf Grundlage Ihrer Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO. Weitere Informationen: <A href="https://de-de.facebook.com/about/privacy/">Datenschutzhinweise von Meta</A>.</P>
        <P>Sie können die Remarketing-Funktion unter <A href="https://www.facebook.com/ads/preferences/?entry_product=ad_settings_screen">Facebook Anzeigeeinstellungen</A> deaktivieren oder über die <A href="http://www.youronlinechoices.com/de/praferenzmanagement/">European Interactive Digital Advertising Alliance</A>.</P>

        {/* 7 */}
        <H2>7. Newsletter</H2>

        <H3>Newsletterdaten</H3>
        <P>Wenn Sie den auf der Website angebotenen Newsletter beziehen möchten, benötigen wir von Ihnen eine E-Mail-Adresse sowie Informationen, welche uns die Überprüfung gestatten, dass Sie der Inhaber der angegebenen E-Mail-Adresse sind.</P>

        <H3>CleverReach</H3>
        <P>Diese Website nutzt CleverReach für den Versand von Newslettern. Anbieter ist die CleverReach GmbH &amp; Co. KG, Schafjückenweg 2, 26180 Rastede. Näheres entnehmen Sie den <A href="https://www.cleverreach.com/de/datenschutz/">Datenschutzbestimmungen von CleverReach</A>. Die Datenverarbeitung erfolgt auf Grundlage Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO).</P>

        {/* 8 */}
        <H2>8. Plugins und Tools</H2>

        <H3>Google Fonts (lokales Hosting)</H3>
        <P>Diese Seite nutzt zur einheitlichen Darstellung von Schriftarten Google Fonts, die lokal installiert sind. Eine Verbindung zu Servern von Google findet dabei nicht statt. Weitere Informationen: <A href="https://developers.google.com/fonts/faq">developers.google.com/fonts/faq</A>.</P>

        {/* 9 */}
        <H2>9. eCommerce und Zahlungsanbieter</H2>

        <H3>Verarbeiten von Kunden- und Vertragsdaten</H3>
        <P>Wir erheben, verarbeiten und nutzen personenbezogene Kunden- und Vertragsdaten zur Begründung, inhaltlichen Ausgestaltung und Änderung unserer Vertragsbeziehungen. Rechtsgrundlage hierfür ist Art. 6 Abs. 1 lit. b DSGVO.</P>
        <P>Die erhobenen Kundendaten werden nach Abschluss des Auftrags oder Beendigung der Geschäftsbeziehung und Ablauf der ggf. bestehenden gesetzlichen Aufbewahrungsfristen gelöscht. Gesetzliche Aufbewahrungsfristen bleiben unberührt.</P>

      </div>
    </section>
  );
}
