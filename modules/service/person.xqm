xquery version "3.0";
(:
    Person search module
:)

module namespace person="http://exist-db.org/xquery/biblio/service/person";

import module namespace search="http://exist-db.org/xquery/biblio/service/search" at "search.xqm";
import module namespace ngram="http://exist-db.org/xquery/ngram";


(: TEI namesspace :)
declare namespace tei = "http://www.tei-c.org/ns/1.0";
(: Getty namespace :)
declare namespace vp = "http://localhost/namespace";

(: Sample :)
(: Mao Zedong (Chinese theorist, statesman, and poet, 1893-1976) :)
declare function person:searchLocal($query as xs:string) {
   let $results :=  collection("/resources/vocab/")//tei:listPerson/tei:person[ngram:contains(tei:persName, $query)]
   return
      for $result in $results
            let $persName := if (exists($result/tei:persName[@type eq "preferred"])) then ($result/tei:persName[@type eq "preferred"]) else ($result/tei:persName[1])
            return 
                if (exists($persName/tei:forename) or exists($persName/tei:surname))
                then (
                    let $person := $persName/tei:forename/text() || " " || $persName/tei:surname
                    return
                        <suggestions value="{$person}" data="{$person}" bio="" resource="local"/>
                ) else (
                    let $person := $persName/text()
                    return
                      <suggestions value="{$person}" data="{$person}" bio="" resource="local"/>
                ) 
};

declare function person:searchGetty($query as xs:string) {
   let $results :=  collection("/resources/vocab/getty/ulan")//vp:Subject[ngram:contains(.//vp:Term_Text, $query)]
   return
      for $result in $results
            let $persName := if (exists($result//vp:Preferred_Term)) then ($result//vp:Preferred_Term[1]/vp:Term_Text[1]/text()) else ($result//vp:Non-Preferred_Term[1]/vp:Term_Text[1]/text())
            let $bio := if (exists($result//vp:Preferred_Biography)) then ($result//vp:Preferred_Biography[1]//vp:Biography_Text[1]) else ($result//vp:Non-Preferred_Biography[1]/vp:Biography_Text[1])
            return 
                <suggestions value="{$persName} ({$bio})" data="{$persName}" bio="{$bio}" resource="getty"/>
                
};

declare function person:createResults($query as xs:string) {
    <results>
        <query>{$query}</query>
        {
            (person:searchLocal($query), person:searchGetty($query))
        }
        <suggestions value="no result" data="no result"/>
    </results>
};

declare function person:lookup($query as xs:string) {
    person:createResults($query)
};



