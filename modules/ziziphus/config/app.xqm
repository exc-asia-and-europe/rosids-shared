xquery version "3.0";

module namespace app="http://www.betterform.de/projects/shared/config/app";

(: ------------------------------------------------------------------------------------------------------------------------------------------ :)
(: Global settings :)
(: ------------------------------------------------------------------------------------------------------------------------------------------ :)

(: Enable debugging in xqueries :)
declare variable $app:debug as xs:boolean := true();




declare  %private variable $app:shared-dir as xs:string := "/apps/cluster-shared";
declare  %private variable $app:ziziphus-dir as xs:string := "/apps/ziziphus";


(: Name of imagerecord collection :)
declare variable $app:image-record-dir-name as xs:string := "VRA_images/";
declare %private variable $app:common-data-dir as xs:string := $app:data-dir || "commons/";
declare %private variable $app:users-data-dir as xs:string := $app:data-dir || "users/";


(: ------------------------------------------------------------------------------------------------------------------------------------------ :)
(: Services settings :)
(: ------------------------------------------------------------------------------------------------------------------------------------------ :)

declare  %private variable $app:service-dir as xs:string := "/apps/rosids-services";

(: data collection :)
declare %private variable $app:repositories-collection := "/resources/services/repositories/";

(: Remote setting :)
declare variable $app:service-host := "localhost";
declare variable $app:service-port := "8080";
declare variable $app:remote-service-collection := "xmldb:exist://" || $app:service-host || ":" || $app:service-port || "/exist/xmlrpc/db/";


(: collection paths and configurations for EXC repositories :)
declare %private variable $app:global-repositories-collection := $app:repositories-collection || "global/";

(: persons :)
declare %private variable $app:global-persons-repositories-collection := $app:global-repositories-collection || "persons/";
declare variable $app:global-persons-repositories-configuration := <repository name="Persons EXC" authority="local" source="EXC" icon="local"/>;

(: organisations :)
declare %private variable $app:global-organisations-repositories-collection := $app:global-repositories-collection || "organisations/";
declare variable $app:global-organisations-repositories-configuration := <repository name="Organisations EXC" authority="local" source="EXC" icon="local"/>;

(: subjects :)
declare %private variable $app:global-subjects-repositories-collection := $app:global-repositories-collection || "subjects/";
declare variable $app:global-subjects-repositories-configuration := <repository name="Subjects EXC" authority="local" source="EXC" icon="local"/>;

(: ------------------------------------------------------------------------------------------------------------------------------------------ :)

(: "Mirrors" : viaf, getty :)
declare %private variable $app:global-mirrors-repositories-collection := app:repositories-collection || "/global/externalmirrors/";

(: viaf :)
declare %private variable $app:global-viaf-repositories-collection := $app:global-mirrors-repositories-collection || "viaf/";

(: rdf data :)
declare variable $app:global-viaf-rdf-repositories := $app:global-viaf-repositories-collection || 'rdf/';
(: xml data :)
declare variable $app:global-viaf-xml-repositories := $app:global-viaf-repositories-collection || 'xml/';

(: getty :)
declare %private variable $app:global-getty-repositories-collection := $app:global-mirrors-repositories-collection || "getty/";
(: getty subcollections :)
declare %private variable $app:global-getty-ulan-repositories := $app:global-getty-repositories-collection || "ulan/";
declare %private variable $app:global-getty-aat-repositories := $app:global-getty-repositories-collection || "aat/";
declare %private variable $app:global-getty-tgn-repositories := $app:global-getty-repositories-collection || "tgn/";

(: ------------------------------------------------------------------------------------------------------------------------------------------ :)

(: Users and Groups repositories :)
(: Configuration file for custom repositories :)
declare variable $app:repositories-configuration :=  '/repository.xml';

(: Fallback configuration for custom repositories :)
declare variable $app:global-default-repositories-configuration := <repository name="Unnamed Repo" authority="---" source="---" icon="unnamed"/>;

(: User :)
declare %private variable $app:users-repositories-collection := app:repositories-collection || "users/";

(: Groups :)
declare %private variable $app:groups-repositories-collection := app:repositories-collection || "groups/";


(: ------------------------------------------------------------------------------------------------------------------------------------------ :)
(: ziziphus :)
(: ------------------------------------------------------------------------------------------------------------------------------------------ :)
declare %private variable $app:ziziphus-collection-name as xs:string := "Priya_Paul_Collection";
declare variable $app:ziziphus-resources-dir as xs:string := $app:ziziphus-dir || "/resources/";
declare variable $app:ziziphus-default-record-dir as xs:string := $app:common-data-dir || $app:ziziphus-collection-name || "/";  

declare %private variable $app:data-dir as xs:string := "/db/resources/";      

(: ------------------------------------------------------------------------------------------------------------------------------------------ :)
(: shared :)
(: ------------------------------------------------------------------------------------------------------------------------------------------ :)
declare variable $app:code-tables as xs:string := $app:shared-dir || "/modules/edit/code-tables/";
declare variable $app:legends as xs:string := $app:shared-dir || "/modules/edit/code-tables/legends/";

(: ------------------------------------------------------------------------------------------------------------------------------------------ :)
(: tamboti :)
(: ------------------------------------------------------------------------------------------------------------------------------------------ :)