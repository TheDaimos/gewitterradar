"""MA-025 observational source discovery, no cross-provider leakage."""
from pathlib import Path
import runpy
import unittest
from types import SimpleNamespace as E
inventory=runpy.run_path(str(Path(__file__).resolve().parents[1]/
    "custom_components/gewitterradar/monitored_areas/blitzortung_inventory.py"))["collect_inventory"]
class TestBlitzortungInventory(unittest.TestCase):
    def test_scoped_entities(self):
        entries=[E(domain="blitzortung",entry_id="bo-1",title="Hamburg",data={"secret":"X"}),
                 E(domain="sun",entry_id="sun-1",title="private"),
                 E(domain="blitzortung_org",entry_id="bo-2",title="Havanna")]
        entities={"bo-1":[E(entity_id="sensor.hamburg_lightning_counter"),
                          E(entity_id="sensor.hamburg_distance"),
                          E(entity_id="device_tracker.hamburg")],
                  "bo-2":[E(entity_id="sensor.havanna_blitz"),
                          E(entity_id="sensor.bad-name!")]}
        result=inventory(entries,lambda eid:entities.get(eid,[]),lambda eid:None)
        self.assertEqual(len(result["locations"]),2)
        self.assertTrue(result["read_only"])
        self.assertEqual(result["locations"][0]["title"],"Hamburg")
        self.assertEqual(result["locations"][0]["counters"],["sensor.hamburg_lightning_counter"])
        self.assertEqual(result["locations"][0]["distances"],["sensor.hamburg_distance"])
        self.assertEqual(result["locations"][0]["trackers"],["device_tracker.hamburg"])
        self.assertNotIn("secret",str(result))
        self.assertNotIn("bad-name",str(result))
    def test_empty(self):
        self.assertEqual(inventory([],lambda eid:[],lambda eid:None),
                         {"read_only":True,"locations":[]})
if __name__=="__main__":
    unittest.main()
