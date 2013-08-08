xquery version "3.0";

import module namespace person="http://exist-db.org/xquery/biblio/service/person" at "person.xqm";

(:
    Entry point for searches in cluster vocabs.
:)
declare option exist:serialize "method=json media-type=text/javascript";

let $query := request:get-parameter("query", "sa")
let $names := request:get-parameter-names()[1]
return 
switch ($names)
   case "person" return person:lookup(request:get-parameter("person", "sa"))
   default return <results/>