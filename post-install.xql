xquery version "3.0";

import module namespace xdb="http://exist-db.org/xquery/xmldb";

declare variable $target external;
(: cleanup and reindex :)
 xmldb:remove($target || "/data/vocab"), xmldb:reindex("/db")